from django.contrib import admin
from .models import UserFile


@admin.register (UserFile)
class UserFileAdmin (admin.ModelAdmin) :
    list_display = ('original_name', 'user', 'size', 'upload_date', 'download_count', 'is_public')
    list_filter = ('upload_date', 'user', 'is_public')
    search_fields = ('original_name', 'user__username')
    readonly_fields = ('size', 'upload_date', 'download_count', 'public_url')

    def get_queryset(self, request) :
        return super ().get_queryset (request).select_related ('user')