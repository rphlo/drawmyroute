from django.urls import path, re_path, include
from . import views

urlpatterns = [
    path('routes/new', views.RouteCreate.as_view(), name='route_create'),
    path('latest-routes/', views.LatestRoutesList.as_view(), name='latest_routes_list'),
    re_path(r'^user/(?P<username>[a-zA-Z0-9_-]+)/?$', views.UserDetail.as_view(), name='user_detail'),
    re_path(r'^route/(?P<uid>[a-zA-Z0-9_-]+)/?$', views.RouteDetail.as_view(), name='route_detail'),
    re_path(r'^route/(?P<uid>[a-zA-Z0-9_-]+)/map/?$', views.map_download, name='map_image'),
    re_path(r'^route/(?P<uid>[a-zA-Z0-9_-]+)/gpx/?$', views.gpx_download, name='gpx_download'),
    re_path(r'^route/(?P<uid>[a-zA-Z0-9_-]+)/thumbnail/?$', views.map_thumbnail, name='map_thumbnail'),
    path('auth/', include('rest_auth.urls')),
    path('auth/registration/', include('rest_auth.registration.urls')),
    path('auth/login', view=views.LoginView.as_view(), name='knox_login'),
    path('strava/token', view=views.strava_access_token, name='strava_token'),
    path('strava/authorization', view=views.strava_authorize, name='strava_authorize'),
    path('strava/deauthorize', view=views.strava_deauthorize, name='strava_deauthorize'),
]