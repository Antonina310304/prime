function onSendAjax(params) {
    $.ajax({
        type: params.type,
        url: params.url,
        dataType: params.dataType,
        data: params.data,
        // processData: false,
        // contentType: false,
        cache: false,
        success: function (data) {
            //params.onSuccess(data);
        },
        error: function (data) {
            // params.onError();
        },
        complete: function () {
            params.onSuccess();
        }
    });
}


function validateForm(form) {
    var validate = {
        errorClass: 'error',
        input: null,
        attr: 'data-type',
        arrayInput: [],
        form: form,
        isSubmitForm: function () {
            var that = this;
            var isValid = true;
            this.input.each(function () {
                var $this = $(this);
                isValid = isValid && that.isValidValue($this);
            });

            return isValid;
        },

        checkAllError: function() {
            var that = this;
            this.input.each(function () {
                var $this = $(this);
                var parent = $this.parent();
                that.checkError($this, parent);
            });
        },

        checkError: function(input, parent) {
            var typeData = input.attr(this.attr);

            switch (this.isValidValue(input)) {
                case true:
                    this.hideError(parent);
                    break;
                case false:
                    this.showError(parent, typeData);
            }
        },

        hideError: function (parent) {
            parent.removeClass(this.errorClass);
        },

        showError: function(parent, typeData) {
            var errorTextContainer = parent.find('[' + this.attrError + ']');
            parent.addClass(this.errorClass);
        },

        watch: function (input, parent) {
            var that = this;
            input.on('blur', function () {
                var value = $(this).val();
                if(value == '') return;
                that.checkError($(this), parent);
            });
            input.on('input', function () {
                that.hideError(parent);
            });
        },

        addMaskTel: function() {
            this.formTel = form.find('input[' + this.attr + '="tel"]');
            if(!this.formTel.length) return;

            this.formTel.inputmask({
                mask: "+7 (999) 999 99 99",
                placeholder: "_",
                showMaskOnHover: false
            });
        },

        addMaskEmail: function () {
            this.formEmail = form.find('input[' + this.attr + '="email"]');
            if(!this.formEmail.length) return;

            this.formEmail.inputmask('email', {
                placeholder: "",
            });
        },

        addResizeTextArea: function() {
            var textarea = form.find('[' + this.attr + '="textarea"]');
            if(!textarea.length) return;
            autosize(textarea);
        },

        isValidEmail: function(address) {
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            return reg.test(address) == true;
        },

        disabledFields: function() {
            this.input.each(function () {
                $(this).parent().addClass('disabled');
                $(this).attr('disabled', true);
            })
            var textarea = form.find('[' + this.attr + '="textarea"]');
            if(!textarea.length) return;
            textarea.parent().addClass('disabled');
            textarea.attr('disabled', true);
        },

        resetFields: function() {
            this.input.each(function () {
                $(this).parent().removeClass('disabled');
                $(this).val('')
                $(this).attr('disabled', false);
            })
            var textarea = form.find('[' + this.attr + '="textarea"]');
            if(!textarea.length) return;
            textarea.val('');
            textarea.parent().removeClass('disabled');
            textarea.attr('disabled', false);
        },

        isValidValue: function (input) {
            var value;
            var typeData = input.attr(this.attr);

            var isValid = false;
            switch (typeData) {
                case 'tel':
                    value = input.inputmask('unmaskedvalue');
                    isValid = (value.length == 10);
                    break;
                case 'text':
                    value = input.val();
                    isValid = (value !== '');
                    break;
                case 'email':
                    value = input.val();
                    isValid = this.isValidEmail(value);
                    break;
            };
            return isValid;
        },

        init: function () {
            var that = this;
            this.input = this.form.find('input['+ this.attr +'][required]');

            this.addMaskTel();
            this.addMaskEmail();
            this.addResizeTextArea();

            this.input.each(function () {
                var input = {};
                input.input = $(this);
                input.parent = $(this).parent();
                input.type = $(this).attr(that.attr);
                that.arrayInput.push(input);
                that.watch(input.input, input.parent);
            });
        }
    }

    return validate;
};


function submitForm(form, params) {
    // var form = $(formClass);
    if (!form.length) return;

    var validate = validateForm(form);
    validate.init();


    form.on('click', 'button[type="submit"]', function (evt) {
        evt.preventDefault();
        validate.checkAllError();
        var button = form.find('button[type="submit"]');

        if(!validate.isSubmitForm()) return;

        var paramsAjax = {
            type: 'POST',
            url: params.url,
            dataType: 'json',
            data: form.serializeArray(),
            onSuccess: function () {

                //при интеграции надо удалить setTimeout
                setTimeout(function () {
                    params.success();
                    validate.resetFields();
                    button.attr('disabled', false);
                }, 1000)
            },
            onError: function () {
                //form[0].reset();
            },
        }

        //при отправке аякса блокирую поля формы и добавляю disabled кнопке
        button.attr('disabled', true);
        validate.disabledFields();

        onSendAjax(paramsAjax);
    })
}

$('.js-form').each(function () {
    var form = submitForm($(this), {
        url: $(this).attr('action'),
        success: function () {
            sidePageController.runSuccessPage();
        }
    });
})
