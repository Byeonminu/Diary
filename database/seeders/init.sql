use mysql;
CREATE USER 'me'@'172.19.0.2' IDENTIFIED BY 'testpwd';
GRANT ALL ON *.* TO 'me'@'172.19.0.2';
CREATE DATABASE IF NOT EXISTS diary;
USE diary;