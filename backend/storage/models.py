import os
import uuid
from django.db import models
from django.conf import settings

def user_directory_path(instance, filename):
    # Файлы будут загружены в MEDIA_ROOT/user_<id>/<filename>
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return f'user_{instance.user.id}/{filename}'

class UserFile(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='files'
    )
    file = models.FileField(upload_to=user_directory_path)
    original_name = models.CharField(max_length=255)
    comment = models.TextField(blank=True)
    size = models.BigIntegerField(default=0)
    upload_date = models.DateTimeField(auto_now_add=True)
    last_download = models.DateTimeField(null=True, blank=True)
    download_count = models.IntegerField(default=0)
    is_public = models.BooleanField(default=False)
    public_url = models.UUIDField(default=uuid.uuid4, unique=True)
    
    class Meta:
        db_table = 'user_files'
        verbose_name = 'Файл пользователя'
        verbose_name_plural = 'Файлы пользователей'
        ordering = ['-upload_date']
    
    def __str__(self):
        return f"{self.original_name} ({self.user.username})"
    
    def save(self, *args, **kwargs):
        if not self.original_name and self.file:
            self.original_name = os.path.basename(self.file.name)
        if self.file and not self.size:
            self.size = self.file.size
        super().save(*args, **kwargs)