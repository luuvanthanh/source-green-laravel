<?php
/**
 * Global helpers file with misc functions
 *
 */
if (!function_exists('dashesToCamelCase')) {
    function dashesToCamelCase($string, $capitalizeFirstCharacter = false)
    {
        $str = str_replace('-', '', ucwords($string, '-'));

        if (!$capitalizeFirstCharacter) {
            $str = lcfirst($str);
        }

        return $str;
    }
}

if (!function_exists('arraySortByColumn')) {

    function arraySortByColumn(&$array, $column, $direction = SORT_ASC)
    {
        $reference_array = array();

        foreach ($array as $key => $row) {
            $reference_array[$key] = $row[$column];
        }

        array_multisort($reference_array, $direction, $array);
    }
}

if (!function_exists('getFacebookSdk')) {
    function getFacebookSdk()
    {
        $fb = new \Facebook\Facebook([
            'app_id' => env("APP_ID_FACEBOOK"),
            'app_secret' => env("APP_SECRET_FACEBOOK"),
            'default_graph_version' => 'v11.0',
            // 'default_access_token' => $accessToken, // optional
        ]);

        return $fb;
    }
}
