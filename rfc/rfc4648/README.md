# RFC 4648

[The Base16, Base32, and Base64 Data Encodings](./rfc4648.txt)

[Base16、Base32 和 Base64 数据编码](./rfc4648_zh.txt)

## 中英对照

| 中文                 | 英文
|:---------------------|:-------------------------------------
| Base 编码            | Base encoding
| 换行符               | line-wrapping
| 字母表               | alphabet
| 隐蔽信道             | covert channel
| 多用途互联网邮件扩展 | MIME, Multipurpose Internet Mail Extensions
| 隐私增强邮件         | PEM, Privacy Enhanced Mail
| 简单邮件传输协议     | SMTP, Simple Mail Transfer Protocol
| 互联网消息访问协议   | IMAP, Internet Message Access Protocol

## 补充说明

+ **Base 64 编码**指的是某一类编码：这类编码用的字母表中包含 64+1=65 个字符（多出的那一个字符是填充符），每个字符能够表示 sqrt(64)=6 比特的数据。  
  而 **'base64' 编码**、**'base64url' 编码**是指具体编码方案：这些编码方案属于 Base 64 编码，但是确定了具体的编码用的字母表。  
  至于 **base 32 编码**、**'base32' 编码**、**base 16 编码**、**'base16' 编码** 这些名词的解释，与此类似。