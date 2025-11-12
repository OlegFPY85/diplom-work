from rest_framework import serializers
from .models import UserFile

class FileSerializer(serializers.ModelSerializer):
    original_name = serializers.CharField(read_only=True)
    size = serializers.IntegerField(read_only=True)
    upload_date = serializers.DateTimeField(read_only=True)
    last_download = serializers.DateTimeField(read_only=True)
    download_count = serializers.IntegerField(read_only=True)
    public_url = serializers.UUIDField(read_only=True)
    
    class Meta:
        model = UserFile
        fields = '__all__'
        read_only_fields = ('user', 'file', 'public_url')
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
    comment = serializers.CharField(required=False, allow_blank=True)

class FileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFile
        fields = ('comment', 'original_name')