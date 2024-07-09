"""
Django settings for karttamuovi project.

Generated by 'django-admin startproject' using Django 3.0.2.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "kbmccm&64qy7#=inp_*61#&u7g3qs_=bfq-=*5%dv9od3s_zhg"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

LOGIN_URL = "/drf-auth/login/"
# Application definition

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    "routedb",
    "tagging",
    "django.contrib.admin",
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "knox",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "django_s3_storage",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.http.ConditionalGetMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES_DIR = os.path.join(BASE_DIR, "templates")
CLIENT_DIR = os.path.join(BASE_DIR, "frontend")  # react app location
BUILD_DIR = os.path.join(CLIENT_DIR, "build")  # react app build location

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [TEMPLATES_DIR],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "utils.context_processors.url_front",
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "utils.context_processors.site",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

FORCE_LOWERCASE_TAGS = True
MAX_TAG_LENGTH = 30
# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "app_db",
        "USER": "app_user",
        "PASSWORD": "changeme",
        "HOST": "db",
        "PORT": "",
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_ROOT = os.path.normpath(os.path.join(BASE_DIR, "..", "static"))
STATIC_URL = "/static/"
STATICFILES_DIRS = [os.path.join(BUILD_DIR, "static")]

MEDIA_ROOT = os.path.normpath(os.path.join(BASE_DIR, "..", "media"))
MEDIA_URL = "/media/"


# Django Rest Framework Config
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "utils.auth.TokenAuthSupportQueryString",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": [],
}


USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")


# Django CORS Headers
CORS_ALLOW_ALL_ORIGINS = True

AUTHENTICATION_BACKENDS = ("utils.backends.CaseInsensitiveModelBackend",)


SITE_ID = 1

REST_AUTH_REGISTER_SERIALIZERS = {
    "REGISTER_SERIALIZER": "utils.serializers.RegisterSerializer",
}

REST_AUTH_SERIALIZERS = {
    "PASSWORD_RESET_SERIALIZER": "utils.serializers.CustomPasswordResetSerializer",
}

URL_FRONT = "http://localhost:8080"


SLUG_BLACKLIST = [
    ".htaccess",
    ".htpasswd",
    ".well-known",
    "400",
    "401",
    "403",
    "404",
    "405",
    "406",
    "407",
    "408",
    "409",
    "410",
    "411",
    "412",
    "413",
    "414",
    "415",
    "416",
    "417",
    "421",
    "422",
    "423",
    "424",
    "426",
    "428",
    "429",
    "431",
    "500",
    "501",
    "502",
    "503",
    "504",
    "505",
    "506",
    "507",
    "508",
    "509",
    "510",
    "511",
    "about",
    "about-us",
    "abuse",
    "access",
    "account",
    "accounts",
    "ad",
    "add",
    "admin",
    "administration",
    "administrator",
    "ads",
    "advertise",
    "advertising",
    "aes128-ctr",
    "aes128-gcm",
    "aes192-ctr",
    "aes256-ctr",
    "aes256-gcm",
    "affiliate",
    "affiliates",
    "ajax",
    "alert",
    "alerts",
    "alpha",
    "amp",
    "analytics",
    "api",
    "app",
    "apps",
    "asc",
    "assets",
    "atom",
    "auth",
    "authentication",
    "authorize",
    "autoconfig",
    "autodiscover",
    "avatar",
    "backup",
    "banner",
    "banners",
    "beta",
    "billing",
    "billings",
    "blog",
    "blogs",
    "board",
    "bookmark",
    "bookmarks",
    "broadcasthost",
    "business",
    "buy",
    "cache",
    "calendar",
    "campaign",
    "captcha",
    "careers",
    "cart",
    "cas",
    "categories",
    "category",
    "cdn",
    "cgi",
    "cgi-bin",
    "chacha20-poly1305",
    "change",
    "channel",
    "channels",
    "chart",
    "chat",
    "checkout",
    "clear",
    "client",
    "close",
    "cms",
    "com",
    "comment",
    "comments",
    "community",
    "compare",
    "compose",
    "config",
    "connect",
    "contact",
    "contest",
    "cookies",
    "copy",
    "copyright",
    "count",
    "create",
    "crossdomain.xml",
    "css",
    "curve25519-sha256",
    "customer",
    "customers",
    "customize",
    "dashboard",
    "db",
    "deals",
    "debug",
    "delete",
    "desc",
    "dev",
    "developer",
    "developers",
    "diffie-hellman-group-exchange-sha256",
    "diffie-hellman-group14-sha1",
    "disconnect",
    "discuss",
    "dns",
    "dns0",
    "dns1",
    "dns2",
    "dns3",
    "dns4",
    "docs",
    "documentation",
    "domain",
    "download",
    "downloads",
    "downvote",
    "draft",
    "drop",
    "ecdh-sha2-nistp256",
    "ecdh-sha2-nistp384",
    "ecdh-sha2-nistp521",
    "edit",
    "editor",
    "email",
    "enterprise",
    "error",
    "errors",
    "event",
    "events",
    "example",
    "exception",
    "exit",
    "explore",
    "export",
    "extensions",
    "false",
    "family",
    "faq",
    "faqs",
    "favicon.ico",
    "features",
    "feed",
    "feedback",
    "feeds",
    "file",
    "files",
    "filter",
    "follow",
    "follower",
    "followers",
    "following",
    "fonts",
    "forgot",
    "forgot-password",
    "forgotpassword",
    "form",
    "forms",
    "forum",
    "forums",
    "friend",
    "friends",
    "ftp",
    "get",
    "git",
    "go",
    "group",
    "groups",
    "guest",
    "guidelines",
    "guides",
    "head",
    "header",
    "help",
    "hide",
    "hmac-sha",
    "hmac-sha1",
    "hmac-sha1-etm",
    "hmac-sha2-256",
    "hmac-sha2-256-etm",
    "hmac-sha2-512",
    "hmac-sha2-512-etm",
    "home",
    "host",
    "hosting",
    "hostmaster",
    "htpasswd",
    "http",
    "httpd",
    "https",
    "humans.txt",
    "icons",
    "images",
    "imap",
    "img",
    "import",
    "info",
    "insert",
    "investors",
    "invitations",
    "invite",
    "invites",
    "invoice",
    "is",
    "isatap",
    "issues",
    "it",
    "jobs",
    "join",
    "js",
    "json",
    "keybase.txt",
    "learn",
    "legal",
    "license",
    "licensing",
    "limit",
    "live",
    "load",
    "local",
    "localdomain",
    "localhost",
    "lock",
    "login",
    "logout",
    "lost-password",
    "mail",
    "mail0",
    "mail1",
    "mail2",
    "mail3",
    "mail4",
    "mail5",
    "mail6",
    "mail7",
    "mail8",
    "mail9",
    "mailer-daemon",
    "mailerdaemon",
    "map",
    "marketing",
    "marketplace",
    "master",
    "me",
    "media",
    "member",
    "members",
    "message",
    "messages",
    "metrics",
    "mis",
    "mobile",
    "moderator",
    "modify",
    "more",
    "mx",
    "my",
    "net",
    "network",
    "new",
    "news",
    "newsletter",
    "newsletters",
    "next",
    "nil",
    "no-reply",
    "nobody",
    "noc",
    "none",
    "noreply",
    "notification",
    "notifications",
    "ns",
    "ns0",
    "ns1",
    "ns2",
    "ns3",
    "ns4",
    "ns5",
    "ns6",
    "ns7",
    "ns8",
    "ns9",
    "null",
    "oauth",
    "oauth2",
    "offer",
    "offers",
    "online",
    "openid",
    "order",
    "orders",
    "overview",
    "owner",
    "page",
    "pages",
    "partners",
    "passwd",
    "password",
    "pay",
    "payment",
    "payments",
    "photo",
    "photos",
    "pixel",
    "plans",
    "plugins",
    "policies",
    "policy",
    "pop",
    "pop3",
    "popular",
    "portfolio",
    "post",
    "postfix",
    "postmaster",
    "poweruser",
    "preferences",
    "premium",
    "press",
    "previous",
    "pricing",
    "print",
    "privacy",
    "privacy-policy",
    "private",
    "prod",
    "product",
    "production",
    "profile",
    "profiles",
    "project",
    "projects",
    "public",
    "purchase",
    "put",
    "quota",
    "redirect",
    "reduce",
    "refund",
    "refunds",
    "register",
    "registration",
    "remove",
    "replies",
    "reply",
    "report",
    "request",
    "request-password",
    "reset",
    "reset-password",
    "response",
    "return",
    "returns",
    "review",
    "reviews",
    "robots.txt",
    "root",
    "rootuser",
    "rsa-sha2-2",
    "rsa-sha2-512",
    "rss",
    "rules",
    "sales",
    "save",
    "script",
    "sdk",
    "search",
    "secure",
    "security",
    "select",
    "services",
    "session",
    "sessions",
    "settings",
    "setup",
    "share",
    "shift",
    "shop",
    "signin",
    "signup",
    "site",
    "sitemap",
    "sites",
    "smtp",
    "sort",
    "source",
    "sql",
    "ssh",
    "ssh-rsa",
    "ssl",
    "ssladmin",
    "ssladministrator",
    "sslwebmaster",
    "stage",
    "staging",
    "stat",
    "static",
    "statistics",
    "stats",
    "status",
    "store",
    "style",
    "styles",
    "stylesheet",
    "stylesheets",
    "subdomain",
    "subscribe",
    "sudo",
    "super",
    "superuser",
    "support",
    "survey",
    "sync",
    "sysadmin",
    "system",
    "tablet",
    "tag",
    "tags",
    "team",
    "telnet",
    "terms",
    "terms-of-use",
    "test",
    "testimonials",
    "theme",
    "themes",
    "today",
    "tools",
    "topic",
    "topics",
    "tos",
    "tour",
    "tracker",
    "training",
    "translate",
    "translations",
    "trending",
    "trial",
    "true",
    "umac-128",
    "umac-128-etm",
    "umac-64",
    "umac-64-etm",
    "undefined",
    "unfollow",
    "unsubscribe",
    "update",
    "upgrade",
    "usenet",
    "user",
    "username",
    "users",
    "uucp",
    "var",
    "verify",
    "video",
    "view",
    "void",
    "vote",
    "webmail",
    "webmaster",
    "website",
    "widget",
    "widgets",
    "wiki",
    "wpad",
    "write",
    "www",
    "www-data",
    "www1",
    "www2",
    "www3",
    "www4",
    "you",
    "yourname",
    "yourusername",
    "zlib",
    "traccar",
    "maps",
    "sign-up",
    "password-reset",
    "verify-email",
    "password-reset-confirmation",
]

ACCOUNT_AUTHENTICATION_METHOD = "username"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_BLACKLIST = SLUG_BLACKLIST
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_USERNAME_MIN_LENGTH = 2
ACCOUNT_USERNAME_VALIDATORS = "utils.validators.custom_username_validators"
ACCOUNT_ADAPTER = "utils.account_adapter.CustomAccountAdapter"
CUSTOM_ACCOUNT_CONFIRM_EMAIL_URL = "/verify-email/{0}"

EMAIL_HOST = "smtp"
EMAIL_PORT = 1025

OLD_PASSWORD_FIELD_ENABLED = True

REST_KNOX = {
    "TOKEN_TTL": None,
}

# The AWS region to connect to.
AWS_REGION = "us-east-1"
# The AWS access key to use.
AWS_ACCESS_KEY_ID = "minio"
# The AWS secret access key to use.
AWS_SECRET_ACCESS_KEY = "minio123"
# The optional AWS session token to use.
AWS_SESSION_TOKEN = ""
AWS_S3_ENDPOINT_URL = "http://minio:9000"
AWS_S3_BUCKET = "mapdump"
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"


CACHES = {
    "default": {
        "BACKEND": "diskcache.DjangoCache",
        "LOCATION": os.path.join(BASE_DIR, "cache"),
        "TIMEOUT": 300,
        # ^-- Django setting for default timeout of each key.
        "SHARDS": 4,
        "DATABASE_TIMEOUT": 0.10,  # 10 milliseconds
        # ^-- Timeout for each DjangoCache database transaction.
        "OPTIONS": {"size_limit": 2**30},  # 1 gigabyte
    },
}

NODEJS_PATH = "node"
YARN_PATH = "yarn"
try:
    from .local_settings import *  # noqa: F403, F401
except ImportError:
    pass
