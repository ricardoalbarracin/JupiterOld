/* Funciones globales
------------------------------------------------------ */

// Función para serializar formularios a objetos json
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
}

var ignoreAccents = (function () {
    var map = {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', // a
        'ç': 'c',                                                   // c
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',                     // e
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',                     // i
        'ñ': 'n',                                                   // n
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', // o
        'ß': 's',                                                   // s
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',                     // u
        'ÿ': 'y'                                                    // y
    };

    return function ignoreAccents(s) {
        if (!s) { return ''; }
        var ret = '';
        for (var i = 0; i < s.length; i++) {
            ret += map[s.charAt(i)] || s.charAt(i);
        }
        return ret;
    };
}());

// Funcion para retornar el valor de una cookie a partir de su nombre
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Funcion para decodificar cadenas de texto en base 64
function toBase64Decode(encoded) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    do {
        enc1 = keyStr.indexOf(encoded.charAt(i++));
        enc2 = keyStr.indexOf(encoded.charAt(i++));
        enc3 = keyStr.indexOf(encoded.charAt(i++));
        enc4 = keyStr.indexOf(encoded.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
    } while (i < encoded.length);

    return output;
}


/* Class Utils
------------------------------------------------------ */
var Utils = function () {
    "use strict"    
    return {
        addGridDataItem: function (targetId, dataItem) {
            var grid = $(targetId).data("kendoGrid");
            grid.dataSource.add(dataItem);
        },
        removeGridDataItem: function (e, targetId) {
            e.preventDefault();
            var grid = $(targetId).data("kendoGrid");
            var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));
            grid.dataSource.remove(dataItem);
        },
        getGridDataSource: function (targetId) {
            var grid = $(targetId).data("kendoGrid");
            var jsonData = jQuery.parseJSON(JSON.stringify(grid.dataSource.data()));
            return jsonData;
        },
        setGridDataSource: function (targetId, jsonData) {
            var grid = $(targetId).data("kendoGrid");
            grid.dataSource.data(jsonData);
        },
        showJasperReport: function (config) {
           var params = $.param(config.params);            
           var jasperServerClient = JSON.parse(toBase64Decode(getCookie("jasperServerClient")));
           var jasperEnvironment = jasperServerClient.Environment;
           var jasperUrlFlow = jasperServerClient.ServerUrl + '/flow.html?_flowId=viewReportFlow&reportUnit=' + jasperEnvironment + config.resource + '&decorate=no&j_username=' + jasperServerClient.Username + '&j_password=' + jasperServerClient.Password + '&userLocale=es_CO&' + params;
           var htmlOutput = '<object data="' + jasperUrlFlow + '" width="' + config.width + '" height="' + config.height + '"><embed src="' + jasperUrlFlow + '" width="' + config.width + '" height="' + config.height + '"></embed> Error: Embedded data could not be displayed.</object>';
           $(config.container).html(htmlOutput);
        },
        showJasperDashboard: function (config) {
            var params = $.param(config.params);
            var jasperServerClient = JSON.parse(toBase64Decode(getCookie("jasperServerClient")));
            var jasperEnvironment = jasperServerClient.Environment;
            var jasperUrlViewer = jasperServerClient.ServerUrl + '/dashboard/viewer.html?decorate=no&j_username=' + jasperServerClient.Username + '&j_password=' + jasperServerClient.Password + '&userLocale=es_CO#' + jasperEnvironment + config.resource;
            var htmlOutput = '<object data="' + jasperUrlViewer + '" width="' + config.width + '" height="' + config.height + '"><embed src="' + jasperUrlViewer + '" width="' + config.width + '" height="' + config.height + '"></embed> Error: Embedded data could not be displayed.</object>';
            $(config.container).html(htmlOutput);
        },
        showModalBs: function (path, dataModalValue, params) {
            dataModalValue = typeof dataModalValue !== 'undefined' ? dataModalValue : ""; //default value
            
            if (typeof params !== 'undefined' && params != null) {
                params = "?" + $.param(params);
            } else {
                params = "";
            }

            modalBsContent.load(path + params, function (response, status, xhr) {
                switch (status) {
                    case "success":
                        modalBs.modal({ backdrop: 'static', keyboard: false }, 'show');

                        if (dataModalValue == "modal-lg") {
                            modalBs.find(".modal-dialog").addClass("modal-lg");
                        } else {
                            modalBs.find(".modal-dialog").removeClass("modal-lg");
                        }

                        // Intercepta links para salto a otras paginas
                        handleLoadingOnLinks();

                        // Activa los place holder de los campos
                        handleEnablePlaceholder();

                        try {
                            onModalInit(); // Inicializa el popup
                        } catch (ex) {
                        }

                        
                        break;

                    case "error":
                        var message = "Error de ejecución: " + xhr.status + " " + xhr.statusText;
                        if (xhr.status == 403) $.msgbox(response, { type: 'error' });
                        else $.msgbox(message, { type: 'error' });
                        break;
                }
            });
        },

        addSectionToContainer: function (sessionsContainer, sectionId, sectionObj) {
            sessionsContainer.facade[sectionId] = sectionObj;
        },

        isValidSections: function (facade, sectionsToValidate) {
            var dataSections;

            for (var idx in facade) {
                if ($.inArray(idx, sectionsToValidate) >= 0) {
                    var sectionObj = facade[idx];
                    var isValid = sectionObj.validateForm();
                    if (!isValid) {
                        return false;
                    }
                }
            }

            return true
        },

        getDataSections: function (facade, sectionsToValidate) {
            var dataSections;
            var sections = {};

            for (var idx in facade) {
                if ($.inArray(idx, sectionsToValidate) >= 0) {
                    var sectionObj = facade[idx];
                    sectionObj.form.submit();
                    sections[idx] = {
                        SectionId: sectionObj.sectionId,
                        Model: sectionObj.model,
                        DataForm: JSON.stringify(sectionObj.dataForm)
                    };
                }
            }

            dataSections = {
                Sections: sections
            };

            return dataSections;
        },

        setMenuItemPixelAdminByUrl: function (url) {
            var elHasClass = function (el, selector) {
                return (" " + el.className + " ").indexOf(" " + selector + " ") > -1;
            };

            var bubble = (function (_this) {
                return function (li) {
                    li.className += " active";
                    if (!elHasClass(li.parentNode, "navigation")) {
                        li = li.parentNode.parentNode;
                        li.className += " open";
                        return bubble(li);
                    }
                };
            })(this);

            var nav = $("#main-menu .navigation");
            nav.find("li").removeClass("open active");
            var links = nav[0].getElementsByTagName("a");

            for (var _i = 0; _i < links.length; _i++) {
                var a = links[_i];

                if (a.href.replace(document.location.origin, "").toLowerCase().search(url.toLowerCase()) >= 0) {
                    setTimeout(function () {
                        bubble(a.parentNode);
                    }, 200);
            
                    break;
                }
            }
        }
    };
}();

/* Class User
------------------------------------------------------ */
var User = function () {
    "use strict"
    return {
        getListPermissions: function () {
            var permissions;

            // Valida que la variable "permissions" existe para asi devolverla
            if (typeof sessionStorage.getItem("permissions") !== "undefined") {
                permissions = JSON.parse(localStorage.permissions);
            } else {
                permissions = [];
            }

            return permissions;
        },

        hasPermission: function (permissionsString) {

            // Valida que la variable "permissions" existe
            if (typeof sessionStorage.getItem("permissions") !== "undefined") {
                var permissions = JSON.parse(localStorage.permissions);
                var permissionArray = permissionsString.split(",");

                var idx, item;
                for (idx in permissions) {
                    item = permissions[idx];

                    if ($.inArray(item.Code, permissionArray) != -1) {
                        return true; // Existe permiso
                    }
                }

                return false; // No existe el permiso

            } else {
                return false;
            }
        }
    };
}();

/* 01 Inicializa menu antes de que cargar la página
------------------------------------------------------ */
function handlePixelAdminMenuExtended_Pre() {
    console.log("((handlePixelAdminMenuExtended_Pre))");

    var detect_active_predicate = function (href, url) {
        return href === url;
    }

    var elHasClass = function (el, selector) {
        return (" " + el.className + " ").indexOf(" " + selector + " ") > -1;
    };

    var a, bubble, links, nav, predicate, url, _i, _len, _results;
    url = (document.location + '').replace(/\#.*?$/, '');
    predicate = detect_active_predicate;
    nav = $('#main-menu .navigation');
    nav.find('li').removeClass('open active');
    links = nav[0].getElementsByTagName('a');
    bubble = (function (_this) {
        return function (li) {
            li.className += ' active';
            if (!elHasClass(li.parentNode, 'navigation')) {
                li = li.parentNode.parentNode;
                li.className += ' open';
                return bubble(li);
            }
        };
    })(this);

    _results = [];
    for (_i = 0, _len = links.length; _i < _len; _i++) {
        a = links[_i];
        if (a.href.indexOf('#') === -1 && predicate(a.href, url)) {
            bubble(a.parentNode);
            break;
        } else {
            _results.push(void 0);
        }
    }
    return _results;
};

/* 02. Configura formato por defecto de kendo datepicker y kendo datetimepicker*/
function handleKendoDateFormat_Pre() {
    console.log("((handleKendoDateFormat_Pre))");

    kendo.ui.DatePicker.prototype.options.format = "dd/MM/yyyy";
    kendo.ui.DateTimePicker.prototype.options.format = "dd/MM/yyyy HH:mm";

    kendo.ui.DatePicker.fn.options.format = "dd/MM/yyyy";
    kendo.ui.DateTimePicker.fn.options.format = "dd/MM/yyyy HH:mm";
}

/* 03. Configura filtro por defecto para las grillas que contienen campos de fecha y texto en "Is after or equal to", "Contains" */
function handleKendoStringAndDateFilter_Pre() {
    console.log("((handleKendoStringAndDateFilter_Pre))");

    // for menu
    var stringOps = kendo.ui.FilterMenu.prototype.options.operators.string;
    var containsOp = { startswith: "Starts with" };
    kendo.ui.FilterMenu.prototype.options.operators.string = $.extend({}, containsOp, stringOps);

    var dateOps = kendo.ui.FilterMenu.prototype.options.operators.date;
    var gteOp = { gte: "Is after or equal to" };
    kendo.ui.FilterMenu.prototype.options.operators.date = $.extend({}, gteOp, dateOps);

    // for cell row
    var cellmenu = kendo.ui.FilterCell.prototype.options;
    cellmenu.minLength = 50;
    stringOps = cellmenu.operators.string;
    cellmenu.operators.string = $.extend({}, containsOp, stringOps);
    cellmenu.messages.isFalse = "F";
    cellmenu.messages.isTrue = "T";

    var dateOps = cellmenu.operators.date;    
    cellmenu.operators.date = $.extend({}, gteOp, dateOps);

    var numberOps = cellmenu.operators.number;
    cellmenu.operators.number = $.extend({}, gteOp, numberOps);
}

/* 04. Configura filtro de celda "row" con el relog para especificar el la hora y minutos */
function handleDateTimeColumnFilter_Pre(args) {
    console.log("((handleDateTimeColumnFilter_Pre))");
    args.element.kendoDateTimePicker();
}

/* 05. Establece los controles desde y hasta para los filtros de fechas en las grillas por defecto*/
function handleOnGridFilterInit(e) {
    var type = e.sender.dataSource.options.schema.model.fields[e.field].type

    if (type == "date") {
        var beginOperator = e.container.find("[data-role=dropdownlist]:eq(0)").data("kendoDropDownList");
        beginOperator.value("gte");
        beginOperator.trigger("change");

        var endOperator = e.container.find("[data-role=dropdownlist]:eq(2)").data("kendoDropDownList");
        endOperator.value("lte");
        endOperator.trigger("change");
    }
};

/* 06. Configura la cultura en español de los componentes de kendo*/
function handleKendoCulture_Pre() {
    console.log("((handleKendoCulture_Pre))");
    kendo.culture("es");
}




