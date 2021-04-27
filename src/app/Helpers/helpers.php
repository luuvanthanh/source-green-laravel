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
