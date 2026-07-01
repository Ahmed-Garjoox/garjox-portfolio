from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponseRedirect, JsonResponse

def root_redirect(request):
    return HttpResponseRedirect('http://localhost:5173')

def api_index(request):
    return JsonResponse({
        "message": "Garjoox API is running ✅",
        "docs": "http://localhost:8000/api/",
        "admin": "http://localhost:8000/admin/",
        "frontend": "http://localhost:5173",
    })

urlpatterns = [
    path('', root_redirect),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]

# Serve media files in both development and production
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
