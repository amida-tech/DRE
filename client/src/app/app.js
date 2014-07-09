/*=======================================================================
Copyright 2013 Amida Technology Solutions (http://amida-tech.com)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
======================================================================*/

var dre = angular
    .module('dre', [
        'ngRoute',
        'dre.record',
        'dre.storage',
        'dre.dashboard',
        'dre.demographics',
        'dre.match',
        'dre.match.review',
        'directives.fileModel',
        'services.fileUpload',
        'services.getNotifications',
        'services.recordFunctions'
    ])
    .filter('bb_date', function($filter) {
        //Format Blue Button date JSON struct into string (with precision)

        return function(input_date) {
            if (typeof input_date === "undefined") {
                return "";
            }

            var tmpDateArr;
            if (input_date.precision === "year") {
                tmpDateArr = $filter('date')(input_date.date, 'yyyy');
                //input_date.displayDate = tmpDateArr;
            }
            if (input_date.precision === "month") {
                tmpDateArr = $filter('date')(input_date.date, 'MMM, yyyy');
                //input_date.displayDate = tmpDateArr;
            }
            if (input_date.precision === "day") {
                tmpDateArr = $filter('date')(input_date.date, 'mediumDate');
                //input_date.displayDate = tmpDateArr;
            }
            if (input_date.precision === "hour") {
                tmpDateArr = $filter('date')(input_date.date, 'MMM d, y h:mm a');
                //input_date.displayDate = tmpDateArr;
            }
            if (input_date.precision === "minute") {
                tmpDateArr = $filter('date')(input_date.date, 'MMM d, y h:mm a');
                //input_date.displayDate = tmpDateArr;
            }
            if (input_date.precision === "second") {
                tmpDateArr = $filter('date')(input_date.date, 'MMM d, y h:mm a');
                //input_date.displayDate = tmpDateArr;
            }
            if (input_date.precision === "subsecond") {
                tmpDateArr = $filter('date')(input_date.date, 'MMM d, y h:mm a');
                //input_date.displayDate = tmpDateArr;
            }

            return tmpDateArr;
        };
    })
    .filter('bb_name', function($filter) {
        //Format Blue Button name JSON struct into string

        return function(input_name) {
            if (typeof input_name === "undefined") {
                return "";
            }

            var full_name;

            if (input_name.first) {
                full_name = input_name.first + " ";
            }

            if (input_name.middle && input_name.middle.length > 0) {
                for (var m in input_name.middle) {
                    full_name = full_name + input_name.middle[m] + " ";
                }
            }

            if (input_name.last) {
                full_name = full_name + input_name.last;
            }

            full_name = full_name.trim();


            return full_name;
        };
    })
    .filter('bb_language', function($filter) {
        //Format Blue Button language code into human readable string

        return function(lang) {
            if (typeof lang === "undefined") {
                return "";
            }

            switch (lang) {
                case "en":
                    return "English";
                case "eng":
                    return "English";

                case "aa":
                    return "Afar";
                case "ab":
                    return "Abkhazian";
                case "ae":
                    return "Avestan";
                case "af":
                    return "Afrikaans";
                case "ak":
                    return "Akan";
                case "am":
                    return "Amharic";
                case "an":
                    return "Aragonese";
                case "ar":
                    return "Arabic";
                case "as":
                    return "Assamese";
                case "av":
                    return "Avaric";
                case "ay":
                    return "Aymara";
                case "az":
                    return "Azerbaijani";
                case "ba":
                    return "Bashkir";
                case "be":
                    return "Belarusian";
                case "bg":
                    return "Bulgarian";
                case "bh":
                    return "Bihari";
                case "bi":
                    return "Bislama";
                case "bm":
                    return "Bambara";
                case "bn":
                    return "Bengali";
                case "bo":
                    return "Tibetan";
                case "bo":
                    return "Tibetan";
                case "br":
                    return "Breton";
                case "bs":
                    return "Bosnian";
                case "ca":
                    return "Catalan";
                case "ce":
                    return "Chechen";
                case "ch":
                    return "Chamorro";
                case "co":
                    return "Corsican";
                case "cr":
                    return "Cree";
                case "cs":
                    return "Czech";
                case "cs":
                    return "Czech";
                case "cu":
                    return "Church Slavic";
                case "cv":
                    return "Chuvash";
                case "cy":
                    return "Welsh";
                case "cy":
                    return "Welsh";
                case "da":
                    return "Danish";
                case "de":
                    return "German";
                case "de":
                    return "German";
                case "dv":
                    return "Divehi";
                case "dz":
                    return "Dzongkha";
                case "ee":
                    return "Ewe";
                case "el":
                    return "Greek";
                case "eo":
                    return "Esperanto";
                case "es":
                    return "Spanish";
                case "et":
                    return "Estonian";
                case "eu":
                    return "Basque";
                case "eu":
                    return "Basque";
                case "fa":
                    return "Persian";
                case "fa":
                    return "Persian";
                case "ff":
                    return "Fulah";
                case "fi":
                    return "Finnish";
                case "fj":
                    return "Fijian";
                case "fo":
                    return "Faroese";
                case "fr":
                    return "French";
                case "fr":
                    return "French";
                case "fy":
                    return "Western Frisian";
                case "ga":
                    return "Irish";
                case "gd":
                    return "Gaelic";
                case "gl":
                    return "Galician";
                case "gn":
                    return "Guarani";
                case "gu":
                    return "Gujarati";
                case "gv":
                    return "Manx";
                case "ha":
                    return "Hausa";
                case "he":
                    return "Hebrew";
                case "hi":
                    return "Hindi";
                case "ho":
                    return "Hiri Motu";
                case "hr":
                    return "Croatian";
                case "ht":
                    return "Haitian";
                case "hu":
                    return "Hungarian";
                case "hy":
                    return "Armenian";
                case "hy":
                    return "Armenian";
                case "hz":
                    return "Herero";
                case "ia":
                    return "Interlingua";
                case "id":
                    return "Indonesian";
                case "ie":
                    return "Interlingue";
                case "ig":
                    return "Igbo";
                case "ii":
                    return "Sichuan Yi";
                case "ik":
                    return "Inupiaq";
                case "io":
                    return "Ido";
                case "is":
                    return "Icelandic";
                case "is":
                    return "Icelandic";
                case "it":
                    return "Italian";
                case "iu":
                    return "Inuktitut";
                case "ja":
                    return "Japanese";
                case "jv":
                    return "Javanese";
                case "ka":
                    return "Georgian";
                case "ka":
                    return "Georgian";
                case "kg":
                    return "Kongo";
                case "ki":
                    return "Kikuyu";
                case "kj":
                    return "Kuanyama";
                case "kk":
                    return "Kazakh";
                case "kl":
                    return "Kalaallisut";
                case "km":
                    return "Central Khmer";
                case "kn":
                    return "Kannada";
                case "ko":
                    return "Korean";
                case "kr":
                    return "Kanuri";
                case "ks":
                    return "Kashmiri";
                case "ku":
                    return "Kurdish";
                case "kv":
                    return "Komi";
                case "kw":
                    return "Cornish";
                case "ky":
                    return "Kirghiz";
                case "la":
                    return "Latin";
                case "lb":
                    return "Luxembourgish";
                case "lg":
                    return "Ganda";
                case "li":
                    return "Limburgan";
                case "ln":
                    return "Lingala";
                case "lo":
                    return "Lao";
                case "lt":
                    return "Lithuanian";
                case "lu":
                    return "Luba-Katanga";
                case "lv":
                    return "Latvian";
                case "mg":
                    return "Malagasy";
                case "mh":
                    return "Marshallese";
                case "mi":
                    return "Maori";
                case "mi":
                    return "Maori";
                case "mk":
                    return "Macedonian";
                case "mk":
                    return "Macedonian";
                case "ml":
                    return "Malayalam";
                case "mn":
                    return "Mongolian";
                case "mr":
                    return "Marathi";
                case "ms":
                    return "Malay";
                case "ms":
                    return "Malay";
                case "mt":
                    return "Maltese";
                case "my":
                    return "Burmese";
                case "my":
                    return "Burmese";
                case "na":
                    return "Nauru";
                case "nb":
                    return "Norwegian";
                case "nd":
                    return "North Ndebele";
                case "ne":
                    return "Nepali";
                case "ng":
                    return "Ndonga";
                case "nl":
                    return "Dutch; Flemish";
                case "nl":
                    return "Dutch; Flemish";
                case "nn":
                    return "Norwegian Nynorsk";
                case "no":
                    return "Norwegian";
                case "nr":
                    return "South Ndebele";
                case "nv":
                    return "Navajo";
                case "ny":
                    return "Chichewa";
                case "oc":
                    return "Occitan";
                case "oj":
                    return "Ojibwa";
                case "om":
                    return "Oromo";
                case "or":
                    return "Oriya";
                case "os":
                    return "Ossetian";
                case "pa":
                    return "Panjabi";
                case "pi":
                    return "Pali";
                case "pl":
                    return "Polish";
                case "ps":
                    return "Pashto";
                case "pt":
                    return "Portuguese";
                case "qu":
                    return "Quechua";
                case "rm":
                    return "Romansh";
                case "rn":
                    return "Rundi";
                case "ro":
                    return "Romanian";
                case "ru":
                    return "Russian";
                case "rw":
                    return "Kinyarwanda";
                case "sa":
                    return "Sanskrit";
                case "sc":
                    return "Sardinian";
                case "sd":
                    return "Sindhi";
                case "se":
                    return "Northern Sami";
                case "sg":
                    return "Sango";
                case "si":
                    return "Sinhala";
                case "sk":
                    return "Slovak";
                case "sk":
                    return "Slovak";
                case "sl":
                    return "Slovenian";
                case "sm":
                    return "Samoan";
                case "sn":
                    return "Shona";
                case "so":
                    return "Somali";
                case "sq":
                    return "Albanian";
                case "sq":
                    return "Albanian";
                case "sr":
                    return "Serbian";
                case "ss":
                    return "Swati";
                case "st":
                    return "Sotho, Southern";
                case "su":
                    return "Sundanese";
                case "sv":
                    return "Swedish";
                case "sw":
                    return "Swahili";
                case "ta":
                    return "Tamil";
                case "te":
                    return "Telugu";
                case "tg":
                    return "Tajik";
                case "th":
                    return "Thai";
                case "ti":
                    return "Tigrinya";
                case "tk":
                    return "Turkmen";
                case "tl":
                    return "Tagalog";
                case "tn":
                    return "Tswana";
                case "to":
                    return "Tonga (Tonga Islands)";
                case "tr":
                    return "Turkish";
                case "ts":
                    return "Tsonga";
                case "tt":
                    return "Tatar";
                case "tw":
                    return "Twi";
                case "ty":
                    return "Tahitian";
                case "ug":
                    return "Uighur";
                case "uk":
                    return "Ukrainian";
                case "ur":
                    return "Urdu";
                case "uz":
                    return "Uzbek";
                case "ve":
                    return "Venda";
                case "vi":
                    return "Vietnamese";
                case "vo":
                    return "Volapuk";
                case "wa":
                    return "Walloon";
                case "wo":
                    return "Wolof";
                case "xh":
                    return "Xhosa";
                case "yi":
                    return "Yiddish";
                case "yo":
                    return "Yoruba";
                case "za":
                    return "Zhuang";
                case "zh":
                    return "Chinese";
                case "zh":
                    return "Chinese";
                case "zu":
                    return "Zulu";
            }

            return lang;
        };
    })
    .filter('bb_address', function($filter) {
        //Format Blue Button address JSON struct into string

        return function(address) {
            if (typeof address === "undefined") {
                return "";
            }

            var displayAddress = [];

            if (address.streetLines && address.streetLines.length > 0) {
                for (var addrLine in address.streetLines) {
                    displayAddress.push(address.streetLines[addrLine]);
                }
            }
            var cityLine = "";
            var cityTest = "";
            if (address.city) {
                cityTest = cityLine.length > 0 ? cityLine = cityLine + " " + address.city + "," : cityLine = address.city + ",";
            }
            if (address.state) {
                cityTest = cityLine.length > 0 ? cityLine = cityLine + " " + address.state : cityLine = address.state;
            }
            if (address.zip) {
                cityTest = cityLine.length > 0 ? cityLine = cityLine + " " + address.zip : cityLine = address.zip;
            }
            if (cityLine.length > 0) {
                displayAddress.push(cityLine);
            }

            return displayAddress.join(", ");
        };
    })


.config(['$routeProvider', '$locationProvider', '$compileProvider',
    function($routeProvider, $locationProvider, $compileProvider) {
        $routeProvider.when('/', {
            templateUrl: 'templates/dashboard/dashboard.tpl.html',
            controller: 'dashboardCtrl'
        });
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);

    }
])
// Note TabService is included but not used to ensure its been instantiated
.run(['$rootScope', '$location',
    function($rootScope, $location) {

    }
]);
