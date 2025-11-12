export const ACCEPTED_FILE_TYPES = [
  'image/*',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/x-rar-compressed',
  'audio/*',
  'video/*',
];

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const STORAGE_LIMITS = {
  FREE: 100 * 1024 * 1024, // 100MB
  PREMIUM: 10 * 1024 * 1024 * 1024, // 10GB
};

export const FILE_ICONS = {
  'image': '🖼️',
  'pdf': '📄',
  'text': '📝',
  'word': '📄',
  'excel': '📊',
  'powerpoint': '📊',
  'zip': '📦',
  'audio': '🎵',
  'video': '🎬',
  'default': '📁',
};

export const getFileIcon = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
    return FILE_ICONS.image;
  } else if (extension === 'pdf') {
    return FILE_ICONS.pdf;
  } else if (['txt', 'md', 'json', 'xml'].includes(extension)) {
    return FILE_ICONS.text;
  } else if (['doc', 'docx'].includes(extension)) {
    return FILE_ICONS.word;
  } else if (['xls', 'xlsx'].includes(extension)) {
    return FILE_ICONS.excel;
  } else if (['ppt', 'pptx'].includes(extension)) {
    return FILE_ICONS.powerpoint;
  } else if (['zip', 'rar', '7z'].includes(extension)) {
    return FILE_ICONS.zip;
  } else if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
    return FILE_ICONS.audio;
  } else if (['mp4', 'avi', 'mkv', 'mov'].includes(extension)) {
    return FILE_ICONS.video;
  } else {
    return FILE_ICONS.default;
  }
};