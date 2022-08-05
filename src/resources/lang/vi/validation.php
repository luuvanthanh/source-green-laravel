<?php
return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages.
    |
     */
    'accepted' => 'Trường phải được chấp nhận.',
    'active_url' => 'Trường không phải là một URL hợp lệ.',
    'after' => 'Trường phải là một ngày sau ngày :date.',
    'after_or_equal' => 'Trường phải là thời gian bắt đầu sau hoặc đúng bằng :date.',
    'alpha' => 'Trường chỉ có thể chứa các chữ cái.',
    'alpha_dash' => 'Trường chỉ có thể chứa chữ cái, số và dấu gạch ngang.',
    'alpha_num' => 'Trường chỉ có thể chứa chữ cái và số.',
    'array' => 'Trường phải là dạng mảng.',
    'before' => 'Trường phải là một ngày trước ngày :date.',
    'before_or_equal' => 'Trường phải là thời gian bắt đầu trước hoặc đúng bằng :date.',
    'between' => [
        'numeric' => 'Trường phải nằm trong khoảng :min - :max.',
        'file' => 'Dung lượng tập tin trong trường phải từ :min - :max kB.',
        'string' => 'Trường phải từ :min - :max ký tự.',
        'array' => 'Trường phải có từ :min - :max phần tử.',
    ],
    'boolean' => 'Trường phải là true hoặc false.',
    'confirmed' => 'Giá trị xác nhận trong trường không khớp.',
    'date' => 'Trường không phải là định dạng của ngày-tháng.',
    'date_format' => 'Trường không giống với định dạng :format.',
    'different' => 'Trường và :other phải khác nhau.',
    'digits' => 'Độ dài của trường phải gồm :digits chữ số.',
    'digits_between' => 'Độ dài của trường phải nằm trong khoảng :min and :max chữ số.',
    'dimensions' => 'Trường có kích thước không hợp lệ.',
    'distinct' => 'Trường có giá trị trùng lặp.',
    'email' => 'Trường phải là một địa chỉ email hợp lệ.',
    'exists' => 'Giá trị đã chọn trong trường không hợp lệ.',
    'file' => 'Trường phải là một tệp tin.',
    'filled' => 'Trường không được bỏ trống.',
    'gt' => [
        'numeric' => 'Giá trị trường phải lớn hơn :value.',
        'file' => 'Dung lượng trường phải lớn hơn :value kilobytes.',
        'string' => 'Độ dài trường phải nhiều hơn :value kí tự.',
        'array' => 'Mảng phải có nhiều hơn :value phần tử.',
    ],
    'gte' => [
        'numeric' => 'Giá trị trường phải lớn hơn hoặc bằng :value.',
        'file' => 'Dung lượng trường phải lớn hơn hoặc bằng :value kilobytes.',
        'string' => 'Độ dài trường phải lớn hơn hoặc bằng :value kí tự.',
        'array' => 'Mảng phải có ít nhất :value phần tử.',
    ],
    'image' => 'Trường phải là định dạng hình ảnh.',
    'in' => 'Giá trị đã chọn trong trường không hợp lệ.',
    'in_array' => 'Trường phải thuộc tập cho phép: :other.',
    'integer' => 'Trường phải là một số nguyên.',
    'ip' => 'Trường phải là một địa chỉ IP.',
    'ipv4' => 'Trường phải là một địa chỉ IPv4.',
    'ipv6' => 'Trường phải là một địa chỉ IPv6.',
    'json' => 'Trường phải là một chuỗi JSON.',
    'lt' => [
        'numeric' => 'Giá trị trường phải nhỏ hơn :value.',
        'file' => 'Dung lượng trường phải nhỏ hơn :value kilobytes.',
        'string' => 'Độ dài trường phải nhỏ hơn :value kí tự.',
        'array' => 'Mảng phải có ít hơn :value phần tử.',
    ],
    'lte' => [
        'numeric' => 'Giá trị trường phải nhỏ hơn hoặc bằng :value.',
        'file' => 'Dung lượng trường phải nhỏ hơn hoặc bằng :value kilobytes.',
        'string' => 'Độ dài trường phải nhỏ hơn hoặc bằng :value kí tự.',
        'array' => 'Mảng không được có nhiều hơn :value phần tử.',
    ],
    'max' => [
        'numeric' => 'Trường không được lớn hơn :max.',
        'file' => 'Dung lượng tập tin trong trường không được lớn hơn :max kB.',
        'string' => 'Trường không được lớn hơn :max ký tự.',
        'array' => 'Trường không được lớn hơn :max phần tử.',
    ],
    'mimes' => 'Trường phải là một tập tin có định dạng: :values.',
    'mimetypes' => 'Trường phải là một tập tin có định dạng: :values.',
    'min' => [
        'numeric' => 'Trường phải tối thiểu là :min.',
        'file' => 'Dung lượng tập tin trong trường phải tối thiểu :min kB.',
        'string' => 'Trường phải có tối thiểu :min ký tự.',
        'array' => 'Trường phải có tối thiểu :min phần tử.',
    ],
    'not_in' => 'Giá trị đã chọn trong trường không hợp lệ.',
    'not_regex' => 'Trường có định dạng không hợp lệ.',
    'numeric' => 'Trường phải là một số.',
    'present' => 'Trường phải được cung cấp.',
    'regex' => 'Trường có định dạng không hợp lệ.',
    'required' => 'Trường không được bỏ trống.',
    'required_if' => 'Trường không được bỏ trống khi trường :other là :value.',
    'required_unless' => 'Trường không được bỏ trống trừ khi :other là :values.',
    'required_with' => 'Trường không được bỏ trống khi một trong :values có giá trị.',
    'required_with_all' => 'Trường không được bỏ trống khi tất cả :values có giá trị.',
    'required_without' => 'Trường không được bỏ trống khi một trong :values không có giá trị.',
    'required_without_all' => 'Trường không được bỏ trống khi tất cả :values không có giá trị.',
    'same' => 'Trường và :other phải giống nhau.',
    'size' => [
        'numeric' => 'Trường phải bằng :size.',
        'file' => 'Dung lượng tập tin trong trường phải bằng :size kB.',
        'string' => 'Trường phải chứa :size ký tự.',
        'array' => 'Trường phải chứa :size phần tử.',
    ],
    'string' => 'Trường phải là một chuỗi ký tự.',
    'timezone' => 'Trường phải là một múi giờ hợp lệ.',
    'unique' => 'Trường đã có trong cơ sở dữ liệu.',
    'uploaded' => 'Trường tải lên thất bại.',
    'url' => 'Trường không giống với định dạng một URL.',
    'check_unique' => 'Trường đã có trong cơ sở dữ liệu.',
    'check_exists' => 'Trường :attribute không hợp lệ.',
    
    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
     */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap attribute place-holders
    | with something more reader friendly such as E-Mail Address instead
    | of "email". This simply helps us make messages a little cleaner.
    |
     */

    'attributes' => [],

];
