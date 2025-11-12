from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone
import logging
from .models import UserFile
from .serializers import (
    FileSerializer,
    FileUploadSerializer,
    FileUpdateSerializer,
    PublicFileSerializer
)
from .permissions import IsFileOwnerOrAdmin

logger = logging.getLogger (__name__)


class FileViewSet (viewsets.ModelViewSet) :
    serializer_class = FileSerializer
    permission_classes = [ IsFileOwnerOrAdmin ]
    parser_classes = [ MultiPartParser, FormParser ]

    def get_queryset(self) :
        user = self.request.user
        user_id = self.request.query_params.get ('user_id')

        if user.is_admin and user_id :
            # Админ запрашивает файлы конкретного пользователя
            return UserFile.objects.filter (user_id=user_id)
        elif user.is_admin :
            # Админ видит все файлы
            return UserFile.objects.all ()
        else :
            # Обычный пользователь видит только свои файлы
            return UserFile.objects.filter (user=user)

    def create(self, request) :
        logger.info (f"Пользователь {request.user.username} загружает файл")
        serializer = FileUploadSerializer (data=request.data)

        if serializer.is_valid () :
            file_obj = request.FILES[ 'file' ]
            user_file = UserFile.objects.create (
                user=request.user,
                file=file_obj,
                original_name=file_obj.name,
                size=file_obj.size,
                comment=serializer.validated_data.get ('comment', '')
            )
            logger.info (f"Файл {file_obj.name} успешно загружен пользователем {request.user.username}")
            return Response (
                FileSerializer (user_file).data,
                status=status.HTTP_201_CREATED
            )

        logger.warning (f"Ошибка загрузки файла: {serializer.errors}")
        return Response (serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs) :
        partial = kwargs.pop ('partial', False)
        instance = self.get_object ()
        serializer = FileUpdateSerializer (instance, data=request.data, partial=partial)

        if serializer.is_valid () :
            self.perform_update (serializer)
            logger.info (f"Файл {instance.original_name} обновлен пользователем {request.user.username}")
            return Response (FileSerializer (instance).data)

        return Response (serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action (detail=True, methods=[ 'get' ])
    def download(self, request, pk=None) :
        user_file = self.get_object ()
        user_file.record_download ()

        logger.info (f"Файл {user_file.original_name} скачан пользователем {request.user.username}")
        response = FileResponse (user_file.file)
        response[ 'Content-Disposition' ] = f'attachment; filename="{user_file.original_name}"'
        return response

    @action (detail=True, methods=[ 'post' ])
    def make_public(self, request, pk=None) :
        user_file = self.get_object ()
        user_file.is_public = True
        user_file.save ()

        public_url = request.build_absolute_uri (f'/api/storage/public/{user_file.public_url}/')
        logger.info (f"Файл {user_file.original_name} стал публичным")
        return Response ({'public_url' : public_url})

    @action (detail=True, methods=[ 'post' ])
    def make_private(self, request, pk=None) :
        user_file = self.get_object ()
        user_file.is_public = False
        user_file.save ()

        logger.info (f"Файл {user_file.original_name} стал приватным")
        return Response ({'message' : 'Файл теперь приватный'})


class PublicFileViewSet (viewsets.ViewSet) :
    permission_classes = [ AllowAny ]

    @action (detail=False, methods=[ 'get' ], url_path='(?P<public_url>[^/.]+)')
    def download_public(self, request, public_url=None) :
        try :
            user_file = get_object_or_404 (UserFile, public_url=public_url, is_public=True)
            user_file.record_download ()

            logger.info (f"Публичный файл {user_file.original_name} скачан")
            response = FileResponse (user_file.file)
            response[ 'Content-Disposition' ] = f'attachment; filename="{user_file.original_name}"'
            return response
        except Http404 :
            logger.warning (f"Попытка скачать несуществующий публичный файл: {public_url}")
            return Response (
                {'error' : 'Файл не найден или недоступен'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action (detail=False, methods=[ 'get' ], url_path='(?P<public_url>[^/.]+)/info')
    def get_public_info(self, request, public_url=None) :
        try :
            user_file = get_object_or_404 (UserFile, public_url=public_url, is_public=True)
            serializer = PublicFileSerializer (user_file)
            return Response (serializer.data)
        except Http404 :
            return Response (
                {'error' : 'Файл не найден или недоступен'},
                status=status.HTTP_404_NOT_FOUND
            )