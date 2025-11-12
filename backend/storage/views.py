from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from .models import UserFile
from .serializers import FileSerializer, FileUploadSerializer, FileUpdateSerializer
from .permissions import IsFileOwnerOrAdmin

class FileViewSet(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    permission_classes = [IsFileOwnerOrAdmin]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin and self.action == 'list':
            # Админы видят все файлы
            return UserFile.objects.all()
        return UserFile.objects.filter(user=user)
    
    def create(self, request):
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            file_obj = request.FILES['file']
            user_file = UserFile.objects.create(
                user=request.user,
                file=file_obj,
                original_name=file_obj.name,
                size=file_obj.size,
                comment=serializer.validated_data.get('comment', '')
            )
            return Response(
                FileSerializer(user_file).data, 
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        user_file = self.get_object()
        user_file.download_count += 1
        user_file.last_download = timezone.now()
        user_file.save()
        
        response = FileResponse(user_file.file)
        response['Content-Disposition'] = f'attachment; filename="{user_file.original_name}"'
        return response
    
    @action(detail=True, methods=['post'])
    def make_public(self, request, pk=None):
        user_file = self.get_object()
        user_file.is_public = True
        user_file.save()
        return Response({'public_url': user_file.public_url})
    
    @action(detail=True, methods=['post'])
    def make_private(self, request, pk=None):
        user_file = self.get_object()
        user_file.is_public = False
        user_file.save()
        return Response({'message': 'Файл теперь приватный'})