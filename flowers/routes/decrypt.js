var jsdecrypt = require('jsdecrypt');
let priv_key = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQDLHM2elMflhv6vysqwT34s6wd5zDYazXVyX4YEjhwBMhG5e/WP
B8FfRZRt5o4Zw2WoMbybBcr3wTX0tjGtDGvB5y/FAb9GKLXQTR9r+95nIYFMm321
5yan9I79vXybtd8ddM1anME0VVBVcmZSap7giyAXJGq368VZ9k4rwyIvBwIDAQAB
AoGAb6bjuTrcL+ZndscpaIYqPBLuxxtk2pL67uZny3U7G8UkTSxBLmD7AZ5EG63T
i4IIDc9ZeHZUvqDtQhotcI0VZkSZDh5UFmp3Hf37p3x6mCmrzs1PW2yR6nZU3uAQ
4Y2IsWrPFbxT1MgeNPCowFVK4ZZsPmvFFRJKedYj0HtNItECQQD0k2kixajGRlsi
umicF4RUFZZUKPcQb5ZLzmWa4b7YgLnf7xclqU2jJ3+j26fGpJ1uxi1tNTlhgQWp
4Q1szb51AkEA1JmVG1/ZrpJ5AlysriQcoQXWXH3Tt3QYS17LEG34SnU8LOAxRzAc
Rn81O+QClXVjZ78yEZJ2g8obBRz1ab8ACwJBAKLb5g55gEFHaDhf2HjYUA2NsmSo
Qpx3MaWY8p+H4wVX8m3jT46Mhl42VxBNnBLyWsMAxA8MegErYRIWAlKJTmECQHC3
2RmBcU2gdS4uapONq+wnxyaUw/qhP/w+DxXv6FO54qS8XQQsWuF5soTFeCU77u9j
rK0qZVGshzTnzKo7TU8CQF37vcKnbEX7fIo/5eJk3rcsJIxk4M51/1q6HNzj8IX4
L2zb3If7TR7c4NH/NWXm3YxseVsrIGxET5VgU5m6QJM=
-----END RSA PRIVATE KEY-----`

async function decrypt(str) {
	return await jsdecrypt.dec(priv_key, str);
} 

module.exports = decrypt;
