//@ts-ignore
import {Utilities} from "https://developers.google.com/apps-script/reference/utilities/utilities#base64EncodeWebSafe(Byte)"

export {
    JWTHmacSha256,
    JWTHmacSha256Encode,
    JWTDecode,
    JWTHmacSha256Verify
}

type Header = "alg" | "typ"

type Payload =
    "iss" | // issuer 簽發者，例如: `https://accounts.google.com`
    "iat" |// 簽發時間
    "exp" |
    "sub" | // 用戶ID
    "aud" |// ClientID
    "nbf" | // not before，在此時間之前不可用
    "jti"

type VerifyResult = {
    header?: Record<Header, string>,
    payload?: Record<Payload, string | number>,
    signature?: {},
    verify: boolean
    err: Error
}

type DecodeResult = {
    "header": Record<Header, string>,
    "payload": Record<Payload, string | number>,
    "signature": {}
}

class JWTHmacSha256 {
    constructor(protected privateKey: string) {
        this.privateKey = privateKey
    }

    static EncodeWithKey(privateKey: string, payload: Record<Payload | string, number | string>, data: Record<string, number | string>): string {
        // Sign token using HMAC with SHA-256 algorithm
        const header = {
            alg: 'HS256',
            typ: 'JWT',
        }

        // 將自定義資料data加入payload
        Object.keys(data).forEach(key => {
            payload[key] = data[key]
        })

        const base64Encode = (text: Object | string, json = true) => {
            const data = json ? JSON.stringify(text) : text
            // https://developers.google.com/apps-script/reference/utilities/utilities#base64EncodeWebSafe(Byte)
            return Utilities.base64EncodeWebSafe(data).replace(/=+$/, '') // 去掉最後面的=(1,無窮個都匹配)
        }

        const toSign = `${base64Encode(header)}.${base64Encode(payload)}`
        // https://developers.google.com/apps-script/reference/utilities/utilities#computehmacsha256signaturevalue,-key
        const signatureBytes = Utilities.computeHmacSha256Signature(toSign, privateKey)
        const signature = base64Encode(signatureBytes, false)
        return `${toSign}.${signature}`
    }

    Encode(payload: Record<Payload | string, number | string>, data: Record<string, number | string>): string {
        return JWTHmacSha256.EncodeWithKey(this.privateKey, payload, data)
    }


    /**
     * 只有對header與payload進行解析，如果要進行驗證，請改用Verify
     * */
    static Decode(token: string): DecodeResult {
        const obj = {
            "header": {},
            "payload": {},
            "signature": {}
        } as DecodeResult
        Object.keys(obj).forEach((key, idx) => {
            if (key === "signature") {
                obj[key] = token.split('.')[idx] // 不處理signature，所以直接返回原始資料
                return
            }
            const data = token.split('.')[idx]
            let decoded = Utilities.newBlob(Utilities.base64Decode(data)).getDataAsString()
            Object.setPrototypeOf(key, JSON.parse(decoded))
            //@ts-ignore
            obj[key] = JSON.parse(decoded)
        })
        return obj
    }

    static VerifyWithKey(privateKey: string, token: string, iss: string = ""): VerifyResult {
        const [headerStr, payloadStr, signature] = token.split('.')
        const signatureBytes = Utilities.computeHmacSha256Signature(`${headerStr}.${payloadStr}`, privateKey)
        const validSignature = Utilities.base64EncodeWebSafe(signatureBytes)

        if (signature !== validSignature.replace(/=+$/, '')) {
            return {
                err: new Error('🔴 Invalid Signature'),
                verify: false
            }
        }

        const obj = JWTHmacSha256.Decode(token) as {
            header: Record<Header, string>,
            payload: Record<Payload, string | number>,
            signature: {},
            verify: boolean
            err: Error
        }

        obj["verify"] = false
        if (obj.header.alg !== "HS256" || obj.header.typ !== "JWT") {
            obj["err"] = new Error("verify error")
            return obj
        }

        if (iss !== "") {
            if (obj.payload.iss != iss) {
                obj["err"] = new Error("iss error")
                return obj
            }
        }

        const now = Date.now()
        /*
        時間:
        const now = Date.now()
        const expires = new Date(now)
        expires.setHours(expires.getHours() + expiresInHours) // 強制更改小時

        Date.now() // 回傳的是millisecond since 1970
        Date.parse('2011-10-05T14:48:00.000Z') // 回傳Date
        new Date().setTime(millisecond) // 可以依據給定的millisecond傳換成時間
        toISOString() // 轉成人方便看的格式

        **/
        if (obj.payload.iat === undefined || obj.payload.iat > now) { // 簽發時間不應該比現在時間還要來的晚
            obj["err"] = new Error(`是偽造的簽發時間. iat=${obj.payload.iat} now=${now}`) // 這些都算明碼，所以即便知道了真實錯誤原因也無妨
            return obj
        }

        if (obj.payload.exp === undefined || now > obj.payload.exp) {
            obj["err"] = new Error(`已過時 now=${now} exp=${obj.payload.exp}`)
            return obj
        }

        obj["verify"] = true
        return obj
    }

    Verify(token: string, iss: string = ""): VerifyResult {
        return JWTHmacSha256.VerifyWithKey(this.privateKey, token, iss)
    }
}


/**
 * 產生JWT字串
 * locations on Google Maps.
 *
 * @example JWTHmacSha256Encode("abc123", `{"iss": "carson.google.com"}`, `{"sub": 12345}`)
 *  =>
 *
 * @param {String} privateKey
 * @param {String} payload 為json字串，可以包含iss, iat, exp, sub, aud, nbf, jti...
 * @param {String} data 請用json字串
 * @return {String} JWT字串
 * @customFunction
 */
function JWTHmacSha256Encode(privateKey: string, payload: string, data: string): string {
    return JWTHmacSha256.EncodeWithKey(privateKey, JSON.parse(payload), JSON.parse(data))
}

/**
 * 解出header, payload, 不對signature進行解析
 *
 * @example JWTDecode("")
 *  =>
 *
 * @param {String} token
 * @param {Number} space 轉成json字串的每個空白間距
 * @return {String} json字串
 * @customFunction
 */
function JWTDecode(token: string, space=0): string {
     return JSON.stringify(JWTHmacSha256.Decode(token), null, space)
}

/**
 * 驗證JWT是否合法
 * locations on Google Maps.
 *
 * @example JWTHmacSha256Verify("myKey", `A23-21349aef`, `{"iss": "carson.com"}`)
 *  =>
 *
 * @param {String} privateKey
 * @param {String} token
 * @param {?String} iss Issuer
 * @return {boolean}
 * @customFunction
 */
function JWTHmacSha256Verify(privateKey: string, token: string, iss: string= ""): boolean {
    const result = JWTHmacSha256.VerifyWithKey(privateKey, token, iss)
    // console.log(result)
    return result.verify
}
