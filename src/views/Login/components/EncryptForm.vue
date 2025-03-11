<template>
  <el-form
    v-show="getShow"
    class="login-form"
    label-position="top"
    label-width="120px"
    size="large"
  >
    <el-row style="margin-right: -10px; margin-left: -10px">
      <!-- 原始 -->
      <el-col :span="24" style="padding: 10px; padding-left: 10px">
        <el-input v-model="text" :rows="8" type="textarea" placeholder="Please input" />
      </el-col>
      <!-- 加密后 -->
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-input v-model="textEncrypt" :rows="8" type="textarea" placeholder="Please input" />
      </el-col>
      <!-- 解密后 -->
      <el-col :span="24" style="padding-right: 10px; padding-left: 10px">
        <el-input v-model="textDecrypt" :rows="8" type="textarea" placeholder="Please input" />
      </el-col>
      <!-- base64测试 -->
      <el-col :span="12" style="padding: 10px">
        <XButton title="base64" class="w-[100%]" type="primary" @click="base64Handle()" />
      </el-col>
      <!-- base64 前后端测试 -->
      <el-col :span="12" style="padding: 10px">
        <XButton title="base64-api" class="w-[100%]" type="primary" @click="base64ApiHandle()" />
      </el-col>
      <!-- rsa测试 -->
      <el-col :span="12" style="padding: 10px">
        <XButton title="ras" class="w-[100%]" type="primary" @click="rsaHandle()" />
      </el-col>
      <!-- rsa 前后端测试 -->
      <el-col :span="12" style="padding: 10px">
        <XButton title="rsa-api" class="w-[100%]" type="primary" @click="rsaApiHandle()" />
      </el-col>
      <!-- aes 测试 -->
      <el-col :span="8" style="padding: 10px">
        <XButton title="aes" class="w-[100%]" type="primary" @click="aesHandle()" />
      </el-col>
      <!-- aes 前后端测试 -->
      <el-col :span="8" style="padding: 10px">
        <XButton title="aes-api" class="w-[100%]" type="primary" @click="aesApiHandle()" />
      </el-col>
      <!-- aes 前后端注解测试 -->
      <el-col :span="8" style="padding: 10px">
        <XButton title="aes-api-anno" class="w-[100%]" type="primary" @click="aesApiAnnoHandle()" />
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
import { LoginStateEnum, useLoginState } from './useLogin'
import { base64Api, rsaApi, aesApi, aesAnnoApi } from '@/api/login'
import CryptoJS from 'crypto-js'
/*
  1. 概述: 处理非对称加解密
  2. 使用方法:
    ```js
    import JSEncrypt from 'jsencrypt'
    const publicKey=''
    const privateKey=''
    let jsencrypt = new JSEncrypt()
    jsencrypt.setPublicKey(publicKey)
    jsencrypt.setPrivateKey(privateKey)
    jsencrypt.encrypt()
    jsencrypt.decrypt()
    ```
  3. 注意事项
    * 如果加解密的文本特别长的话，会出现异常
      - 待加密的文本特别长，然后加密的话，会抛出 Message too long for RSA 的异常
      - 待解密的文本特别长，然后解密的话，会返回false
      - 解决方案: 引入 encryptlong
  4. encryptlong  使用方法
    ```js
    import Encrypt from 'encryptlong'
    const publicKey=''
    const privateKey=''
    let jsencrypt = new Encrypt()
    jsencrypt.setPublicKey(publicKey)
    jsencrypt.setPrivateKey(privateKey)
    // 实际测下来，长文本加密，解密也会出现问题
    jsencrypt.encryptLong()
    jsencrypt.decryptLong()
    ```
*/
import JSEncrypt from 'jsencrypt'
import Encrypt from 'encryptlong'
defineOptions({ name: 'EncryptForm' })
const { getLoginState } = useLoginState()
const getShow = computed(() => unref(getLoginState) === LoginStateEnum.ENCRYPT)
// pnpm install jsencrypt
// pnpm install encryptlong
// 公钥和私钥的 PEM 格式
const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCd/ZNwxw0lr74q4j4cCzfaVIc/GS4yGXCNU3h78jsyPRfJiv2q3AX5i7gnXprEEGL1cJGkV8xIMjLaPiUJ+77GKn+P9YWoXEcsE1uf1sqe0byVYUPZU/5b2CRslv916HR5kqliBSroVHd3rbUatfdgyJGq42yWq1mwSVdVVp2baQIDAQAB'
const privateKey =
  'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJ39k3DHDSWvviriPhwLN9pUhz8ZLjIZcI1TeHvyOzI9F8mK/arcBfmLuCdemsQQYvVwkaRXzEgyMto+JQn7vsYqf4/1hahcRywTW5/Wyp7RvJVhQ9lT/lvYJGyW/3XodHmSqWIFKuhUd3ettRq192DIkarjbJarWbBJV1VWnZtpAgMBAAECgYBhvCJfm+OYMrWzla3Sb2Yn3C6mbA9V0sL7ym04T8sq8vwqI590+ROBIlvTjwSy0WhGaVLPlbi72MH4nIURPfjvaRB+SRpX7oDY6uM4P4566/CRnghwOQyEBJ6KBUznYvKaoLtpoKZgwiY1IMhEEgy/BUmUUOTm+h5oUd1SnZBI2QJBANCzUkUJA1ntUbFXKIqdl5oe+nEavaMhFJ7VMPNgdjmPP792Jv0E+1rmRTdTG0AaXUaJBJrAGWKDr9B73ZpT8a8CQQDBzBfxuUTvmtURWx5CUh2+mKhSKQscxgJTf49Ewn6EFWUlcGpNI8HbRusqiZ82trqTcfoWDK8zNOE9OdpZTAJnAkAaOI17kvhS0hhTeankUIx9lqrMjxmIZ12Z3xs5WMNB1BekTIn1fCzAbPIBU3W3Bhj2Bb0IXF5UHEt4nDdpbmaNAkBKE9SXPmVeXUXSk4zWdwMNpta4SR4JSpr7Bchi1SF9JZx7GiRYBjIEunAL230zcdeRosCgiwqxPSZXu/R9q7NDAkEAriL1DKb+hmjYGF9NNIzFKzo2/iu26VIHce1cevdQDgaiTDt0fPdJ+QbL+Iqs6oc392NU+vcKen/8lNNWcCEjWA=='
const text = ref<string>('')
const textEncrypt = ref<string>('')
const textDecrypt = ref<string>('')

const base64Handle = async () => {
  textEncrypt.value = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text.value))
  textDecrypt.value = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(textEncrypt.value))
}

const base64ApiHandle = async () => {
  const data = await base64Api()
  textEncrypt.value = data
  textDecrypt.value = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(textEncrypt.value))
}

const rsaHandle = async () => {
  let jsencrypt = new Encrypt()
  jsencrypt.setPublicKey(publicKey) // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
  jsencrypt.setPrivateKey(privateKey)
  textEncrypt.value = jsencrypt.encryptLong(text.value) as string
  textDecrypt.value = jsencrypt.decryptLong(textEncrypt.value) as string
}

const rsaApiHandle = async () => {
  //var jsencrypt = new JSEncrypt()
  let jsencrypt = new Encrypt()
  jsencrypt.setPublicKey(publicKey) // 如果是对象/数组的话，需要先JSON.stringify转换成字符串
  jsencrypt.setPrivateKey(privateKey)
  const data = await rsaApi()
  textEncrypt.value = data
  // 解密文本数据

  textDecrypt.value = jsencrypt.decryptLong(data) as string
}

const aesKey = CryptoJS.enc.Utf8.parse('vP04eCxidoTm255L')
const aesIv = CryptoJS.enc.Utf8.parse('1zjgKKQY4aLI4Guw')
const aesHandle = async () => {
  // 加密
  let encrypted = CryptoJS.AES.encrypt(text.value, aesKey, {
    iv: aesIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  textEncrypt.value = encrypted.toString()
  // 解密
  let decrypted = CryptoJS.AES.decrypt(textEncrypt.value, aesKey, {
    iv: aesIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  textDecrypt.value = decrypted.toString(CryptoJS.enc.Utf8)
}

const aesApiHandle = async () => {
  const data = await aesApi()
  textEncrypt.value = data
  // 解密
  let decrypted = CryptoJS.AES.decrypt(textEncrypt.value, aesKey, {
    iv: aesIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  textDecrypt.value = decrypted.toString(CryptoJS.enc.Utf8)
}
const aesApiAnnoHandle = async () => {
  const data = await aesAnnoApi()
  textEncrypt.value = data
  // 解密
  let decrypted = CryptoJS.AES.decrypt(textEncrypt.value, aesKey, {
    iv: aesIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  textDecrypt.value = decrypted.toString(CryptoJS.enc.Utf8)
}
</script>
