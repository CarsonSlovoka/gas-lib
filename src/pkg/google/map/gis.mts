export {
    GoogleMapsDistance,
    GoogleMapsReverseGeoCode,
    GoogleMapsLatLong,
    GoogleMapsDuration
}

let Maps: any

/**
 * Calculate the distance between two
 * locations on Google Maps.
 *
 * @example GoogleMapsDistance("NY 10005", "Hoboken NJ", "walking")
 *  => 3800
 * @example GoogleMapsDistance("NY 10005", "Hoboken NJ", "walking", "text")
 *  => 3.8 mi
 * @example GoogleMapsDistance("NY 10005", "Hoboken NJ", "walking", "text", "zh-TW")
 *
 * @param {"Taipei"} origin The address of starting point
 * @param {"Kaohsiung"} destination The address of destination
 * @param {"driving"|"walking"|"bicycling"|"transit"} mode The mode of travel (driving, walking, bicycling or transit)
 * @param {"text"|"value"} outputFormat text or value
 * @param {"en-US"|"zh-TW"|String} lang a BCP(Best Current Practices)-47 language identifier : https://www.techonthenet.com/js/language_tags.php
 * @return {Number|String} The distance in miles
 *
 * @see https://developers.google.com/apps-script/reference/maps/direction-finder?hl=en
 * @customFunction
 */
function GoogleMapsDistance(origin: string, destination: string, mode: string,
                            outputFormat = "value",
                            lang = "en-US"
): number | string {
    const {routes: [data] = {}} = (Maps as any).newDirectionFinder()
        .setLanguage(lang)
        .setOrigin(origin)
        .setDestination(destination)
        .setMode(mode)
        .getDirections()

    if (!data) {
        throw new Error('No route found!')
    }
    // console.log(data)
    const distance = data.legs[0].distance
    return outputFormat === "value" ? distance.value : distance.text
}

/**
 * Use Reverse Geocoding to get the address of
 * a point location (latitude, longitude) on Google Maps.
 *
 * 透過緯經度來獲取地址名稱
 *
 * @example GoogleMapsReverseGeoCode(23.69781, 120.96051", "zh-TW")
 *  => MXX6+46 台灣南投縣信義鄉
 * @example GoogleMapsReverseGeoCode(23.69781, 120.960515)
 *  => MXX6+46 Xinyi Township(信義鄉), Nantou County(南投), Taiwan
 *
 * @param {23.69781} latitude The latitude to lookup.
 * @param {120.960515} longitude The longitude to lookup.
 * @param {"en-US"|"zh-TW"} lang a BCP(Best Current Practices)-47 language identifier : https://www.techonthenet.com/js/language_tags.php
 * @return {String} The postal address of the point.
 *
 * @see https://developers.google.com/apps-script/reference/maps/geocoder#reversegeocodelatitude,-longitude
 * @customFunction
 */
function GoogleMapsReverseGeoCode(latitude: number, longitude: number, lang: string = "en-US"): string {
    const {results: [data = {}] = []} = Maps.newGeocoder()
        .setLanguage(lang)
        .reverseGeocode(latitude, longitude)
    return data.formatted_address
}

/**
 * Get the latitude and longitude of any
 * address on Google Maps.
 *
 * 透過地址名稱來獲取緯經度
 *
 * @example GoogleMapsLatLong("Taiwan")
 *  => "23.69781, 120.960515"
 *
 * @param {"Taiwan"} address The address to lookup.
 * @return {String} The latitude and longitude of the address. (緯經度座標)
 *
 * @see https://developers.google.com/apps-script/reference/maps/geocoder#geocodeaddress
 * @customFunction
 */
function GoogleMapsLatLong(address: string): string {
    const {results: [data = null] = []} = Maps.newGeocoder().geocode(address)
    if (data === null) {
        throw new Error('Address not found!')
    }
    const {geometry: {location: {lat, lng}} = {} as any} = data
    return `${lat}, ${lng}`
}

/**
 * Calculate the travel time between two locations on Google Maps.
 *
 * 幫您估算兩位置旅行時可能需要花費的時間
 *
 * @example GoogleMapsDuration("NY 10005", "", "Hoboken NJ", "walking")
 *  => 3032
 * @example GoogleMapsDuration("NY 10005", "", "Hoboken NJ", "walking", "text")
 *  => 50 mins 32 secs
 * @example GoogleMapsDuration("NY 10005", ['Lincoln Center', 'New York, NY'], "Hoboken NJ", "walking", "text")
 *  => 4 hour 4 mins 14 secs
 * @example GoogleMapsDuration("台北車站", ['台中車站', '高雄車站'], "台東車站", "driving", "text")
 *  => 7 hr 32 mins 43 secs
 * @example GoogleMapsDuration("台北車站", ['台中車站', '高雄車站'], "台東車站", "driving", "mapURI", "zh-TW")
 *
 * @param {"Taipei"} origin The address of starting point
 * @param {String|[String]} wayPoints address, or []string 中間會經過的地點
 * @param {"台東車站"} destination The address of destination
 * @param {"driving"|"walking"|"bicycling"|"transit"} mode The mode of travel (driving, walking, bicycling or transit)
 * @param {"duration"|"text"|"mapURI"} outputFormat 當您選擇mapURI的時候，會提供網址: 最後面的&key=<YOUR_TOKEN>需要放token，您要自己去申請
 * @param {"en-US"|"zh-TW"|String} lang a BCP(Best Current Practices)-47 language identifier : https://www.techonthenet.com/js/language_tags.php
 * @return {String} duration(second) or mapURL
 *
 * @see https://developers.google.com/apps-script/reference/maps/direction-finder?hl=en
 * @customFunction
 */
function GoogleMapsDuration(origin: string,
                            wayPoints: string | [string],
                            destination: string,
                            mode: string,
                            outputFormat: string = "duration",
                            lang: string = "en-US",
) {
    // * @param {String|[string, string][]} wayPoints address, or List[Tuple[lant, long]]

    /*
    有關於GOOGLE MAPS API的TOKEN申請:
    前往: https://console.cloud.google.com/home/dashboard
    建立專往
    選擇API
    他會要求提供信用卡帳戶資訊: 建立帳單帳戶 (每月會給200美金的抵用額，所以如果用不到200美金就不繳錢, 只能撐10萬次請求: https://mapsplatform.google.com/pricing/?hl=en)

    保護API金鑰: https://console.cloud.google.com/google/maps-apis/credentials?hl=zh-tw
    可在這個網頁SHOE KEY來顯示金鑰的TOKEN
    接著可以使用IP位址來限制這個TOKEN可以在哪邊應用
    **/

    const directionFinder = Maps.newDirectionFinder()
        .setLanguage(lang)
        .setOrigin(origin)

    switch (wayPoints.constructor.name) {
        case "Range":
        case "Array":
            for (const [_, address] of Object.entries(wayPoints)) {
                directionFinder.addWaypoint(address)
            }
            break
        case "String": // 同預設值
        default:
            if (wayPoints !== "") {
                directionFinder.addWaypoint(wayPoints)
            }
    }

    /* 如果有多個地點應該要對每一個Array的時間累加才是結果
    const {routes: [data] = []} = directionFinder
        .setDestination(destination)
        .setMode(mode) // Maps.DirectionFinder.Mode.DRIVING
        .getDirections()

    if (!data) {
        throw new Error('No route found!')
    }
    const {legs: [{duration: {text: time}} = {} as any] = []} = data
     */
    const directions = directionFinder
        .setDestination(destination)
        .setMode(mode) // Maps.DirectionFinder.Mode.DRIVING
        .getDirections()

    switch (outputFormat) {
        case "mapURI":
            // Add markers to the map.
            const map = Maps.newStaticMap()
            // Set up marker styles.
            const markerSize = Maps.StaticMap.MarkerSize.MID;
            const markerColor = Maps.StaticMap.Color.GREEN
            let markerLetterCode = 'A'.charCodeAt(0)
            const routes = directions.routes[0]
            for (let i = 0; i < routes.legs.length; i++) {
                const leg = routes.legs[i]
                if (i == 0) {
                    // Add a marker for the start location of the first leg only.
                    map.setMarkerStyle(markerSize, markerColor, String.fromCharCode(markerLetterCode));
                    map.addMarker(leg.start_location.lat, leg.start_location.lng);
                    markerLetterCode++
                }
                map.setMarkerStyle(markerSize, markerColor, String.fromCharCode(markerLetterCode));
                map.addMarker(leg.end_location.lat, leg.end_location.lng);
                markerLetterCode++;
            }
            return map.getMapUrl() + "&key="
        default:
            let duration = 0 // second
            for (const [_, leg] of Object.entries(directions.routes[0].legs as [any])) {
                /*
                const {lat: s_lat, lng: s_lng} =  leg.start_location
                const [lat: e_lat, lng: e_lang] = leg.end_location
                d.steps: Array // 會教你路線怎麼走
                {value, text} = leg.distance // 169092(公尺), 169km =>
                 */
                const {value, text} = leg.duration // 7505(秒), 2 hours 5 mins
                duration += value
            }
            if (outputFormat === "duration") {
                return duration
            }

            const hours = Math.trunc(duration / 3600)
            const minutes = Math.trunc((duration % 3600) / 60)
            const secs = Math.trunc((duration % 60))

            return (hours > 0 ? `${hours} hr ` : "") +
                (minutes > 0 ? `${minutes} mins ` : "") +
                (secs > 0 ? `${secs} secs` : "")
    }
}
