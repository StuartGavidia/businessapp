ALTER USER 'user'@'%' IDENTIFIED WITH 'caching_sha2_password' BY 'userpassword';
ALTER USER 'root'@'%' IDENTIFIED WITH 'caching_sha2_password' BY 'rootpassword';

SET GLOBAL host_cache_size=0;