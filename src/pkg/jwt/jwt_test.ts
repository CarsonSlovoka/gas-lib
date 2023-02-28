// import * as jwt from "index.mjs"
import {JWTDecode, JWTHmacSha256, JWTHmacSha256Encode, JWTHmacSha256Verify} from "index.mjs"

function TestAll() {
    // JWTHmacSha256 使用class
    {
        const now = Date.now()
        const PrivateKey = "ABC123"
        const jwt = new JWTHmacSha256(PrivateKey)
        const payload = {
            iss: "carson.google.com",
            iat: now,
            exp: now + 5 * 60 * 1000 // 5*60秒
        }
        const data = {
            "sub": "12345", // clientID
        }
        const tokenStr = jwt.Encode(payload, data)
        if (JWTHmacSha256.Decode(tokenStr).payload["iss"] !== "carson.google.com") {
            console.error("Decode的結果有誤")
        }
        const tokenOK = jwt.Verify(tokenStr, "carson.google.com")
        if (!tokenOK.verify) {
            console.error("Verify錯誤")
        }
        console.log(tokenOK)

        const tokenFakeStr = JWTHmacSha256.EncodeWithKey(
            PrivateKey, // PrivateKey+"123"
            {
                iss: "carson.google.com",
                iat: now + 5 * 60 * 1000,
                exp: now - 5 * 60 * 1000 // 故意讓他到期
            },
            {
                "sub": "12345", // clientID
            }
        )

        if (jwt.Verify(tokenFakeStr).verify) {
            console.error("使用偽造的token應該驗證錯誤才是")
        }
    }

    // JWTHmacSha256Encode
    {
        for (const [actual, expected] of [
            [JWTHmacSha256Encode("qcZFSJBgU7WOALZF/z7LNxDHg/ifxkiU4Ip13xln+o8=", `{"iss": "carson.google.com"}`, `{"sub": 12345}`), "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjYXJzb24uZ29vZ2xlLmNvbSIsInN1YiI6MTIzNDV9.yFONgd4iPPA1QTb22odViMVs9Qgc_Zk7oRbA0H6zqIk"],
            [JWTHmacSha256Encode("qcZFSJBgU7WOALZF/z7LNxDHg/ifxkiU4Ip13xln+o8=", `{"iss": "carson.google.com", "iat":1677602266631, "exp": 2677602266631}`, `{"sub": 12345}`), "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjYXJzb24uZ29vZ2xlLmNvbSIsImlhdCI6MTY3NzYwMjI2NjYzMSwiZXhwIjoyNjc3NjAyMjY2NjMxLCJzdWIiOjEyMzQ1fQ.hpZwBcAk8W2UYnUTyGAbm8P_4m_s8NJoPWiQ2qWY7XM"]
        ]) {
            if (actual !== expected) {
                console.error(`actual !== expected. ${actual} !== ${expected}`)
            }
        }
    }

    // JWTHmacSha256Verify
    {
        const isOk = JWTHmacSha256Verify("qcZFSJBgU7WOALZF/z7LNxDHg/ifxkiU4Ip13xln+o8=", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjYXJzb24uZ29vZ2xlLmNvbSIsInN1YiI6MTIzNDV9.yFONgd4iPPA1QTb22odViMVs9Qgc_Zk7oRbA0H6zqIk", "google.com")
        if (isOk) {
            console.error("iss不符，應該要認證不過才是!")
        }
    }

    // JWTDecode
    {
        if (JWTDecode("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjYXJzb24uZ29vZ2xlLmNvbSIsInN1YiI6MTIzNDV9.yFONgd4iPPA1QTb22odViMVs9Qgc_Zk7oRbA0H6zqIk") !== `{"header":{"alg":"HS256","typ":"JWT"},"payload":{"iss":"carson.google.com","sub":12345},"signature":"yFONgd4iPPA1QTb22odViMVs9Qgc_Zk7oRbA0H6zqIk"}`) {
            console.error("decode error")
        }
    }
}
