/* Global definitions
----------------------------------------------  */
var modalBs = $('#modalBs');
var modalBsContent = $('#modalBs').find(".modal-content");
var notification;
var idleTimer, idleCountdownTimer;
var notificationHub;

// Animación desde javascript para Animate.css
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

// Funcion para notificar mensajes en el escritorio siempre y cuando este autorizado por el usuario
var notificationDesktop = function () {
    "use strict"
    return {
        show: function (config, type) {
            var icon;
            var title = "SALUD.SIS";

            switch (type) {
                case "warn":
                    icon = '/Content/images/alert_48.png';
                    break;
                case "info":
                    icon = '/Content/images/info-48.png';
                    break;
                case "error":
                    icon = '/Content/images/cancel_48.png';
                    break;
                case "success":
                    icon = '/Content/images/accepted_48.png';
                    break;
                case "inbox":
                    icon = '/Content/images/msg_notification_icon_64.png';
                    break;
                default:
                    icon = '/Content/images/logo-min.png';
                    break;
            }

            var params = {
                body: config.message,
                dir: 'auto',
                icon: icon
            }

            // Let's check if the browser supports notifications
            if (!("Notification" in window)) {
                console.log("This browser does not support desktop notification");
            }

            // Let's check if the user is okay to get some notification
            else if (Notification.permission === "granted") {
                // If it's okay let's create a notification
                var notification = new Notification(title, params);
            }

            // Otherwise, we need to ask the user for permission
            // Note, Chrome does not implement the permission static property
            // So we have to check for NOT 'denied' instead of 'default'
            else if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {

                    // Whatever the user answers, we make sure we store the information
                    if (!('permission' in Notification)) {
                        Notification.permission = permission;
                    }

                    // If the user is okay, let's create a notification
                    if (permission === "granted") {
                        var notification = new Notification(title, params);
                    }
                });
            }

            // At last, if the user already denied any notification, and you 
            // want to be respectful there is no need to bother him any more.            
        }
    };
}();


/* 01. Handles para oparaciones ajax con modales y formularios
---------------------------------------------  */
function handleAjaxModal() {
    console.log("((handleAjaxModal))");
    // Limpia los eventos asociados para elementos ya existentes, asi evita duplicación
    $("a[data-modal]").unbind("click");

    // Intercepta links para salto a otras paginas
    handleLoadingOnLinks();

    // Evita cachear las transaccione Ajax previas
    $.ajaxSetup({ cache: false });

    // Configura evento del link para aquellos para los que desean abrir popups
    $("a[data-modal]").on("click", function (e) {
        var dataModalValue = $(this).data("modal");

        modalBsContent.load(this.href, function (response, status, xhr) {
            switch (status) {
                case "success":
                    modalBs.modal({ backdrop: 'static', keyboard: false }, 'show');

                    if (dataModalValue == "modal-lg") {
                        modalBs.find(".modal-dialog").addClass("modal-lg");
                    }
                    else if (dataModalValue == "modal-xl") {
                        modalBs.find(".modal-dialog").addClass("modal-xl");
                    }
                    else {
                        modalBs.find(".modal-dialog").removeClass("modal-lg");
                        modalBs.find(".modal-dialog").removeClass("modal-xl");
                    }

                    // Intercepta links para salto a otras paginas
                    handleLoadingOnLinks();

                    // Activa los place holder de los campos
                    handleEnablePlaceholder();

                    // Inicializa el popup
                    try {
                        onModalInit();
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
        return false;
    });


}

function handleModalForm(modal, onSuccess) {
    modal.find('form').submit(function () {
        $.ajax({
            url: this.action,
            type: this.method,
            data: $(this).serialize(),
            success: function (result) {
                onSuccess(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var message = "Error de ejecución: " + textStatus + " " + errorThrown;
                $.msgbox(message, { type: 'error' });
                console.log("Error: ");
            }
        });
        return false;
    });
}

function handleAjaxForm(form, onSuccess) {
    form.submit(function () {
        $.ajax({
            url: this.action,
            type: this.method,
            data: $(this).serialize(),
            success: function (result) {
                onSuccess(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var message = "Error de ejecución: " + textStatus + " " + errorThrown;
                $.msgbox(message, { type: 'error' });
                console.log(message);
            }
        });
        return false;
    });
}

/* Configurador de filtros sin acentos
---------------------------------------------  */
function handleIgnoreAccents(e) {
    var dataSource = e.sender.dataSource.data();
    var dataTextField = this.options.dataTextField;
    var item;

    for (var idx in dataSource) {
        if (!isNaN(idx)) {
            item = dataSource[idx];

            if (item[dataTextField + "Filter"] != null)
                break;

            item[dataTextField + "Filter"] = ignoreAccents(item[dataTextField].toLowerCase());
        }
    }

    var field = dataTextField + "Filter";
    e.sender.dataSource.filter({
        field: field,
        operator: this.options.filter,
        value: ignoreAccents(e.filter.value.toLowerCase())
    });

    e.preventDefault();
}

/* Handles para operaciones ajax y envio de archivos
---------------------------------------------  */
function handleAjaxUploadForm(target, kendoValidate, onSuccess) {
    document.getElementById(target).addEventListener("submit", function (e) {
        var form = e.target;

        if (kendoValidate.data("kendoValidator").validate() && form.getAttribute("enctype") === "multipart/form-data") {
            if (form.dataset.ajax) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var xhr = new XMLHttpRequest();
                xhr.open(form.method, form.action);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200)
                        onSuccess(jQuery.parseJSON(xhr.response));
                };
                xhr.send(new FormData(form));
            }
        }
    }, true);
}

/* 02. Handle pixel admin template
------------------------------------------------------ */
function handlePixelAdmin() {
    init.push(function () {
    });
    window.PixelAdmin.start(init);
}

/* 03. Handle Kendo for globalization
------------------------------------------------------ */
function handleKendoCulture() {
    console.log("((handleKendoCulture))");
    kendo.culture("es");

    // Sobrecarga de mensajes
    var message = $("span.k-pager-info.k-label").text();
    if (message == "No items to display") {
        $("span.k-pager-info.k-label").text("No hay registros");
    }

}

/* 04. Manejador de las caracteristicas del usuario en el webstorage
------------------------------------------------ */
var handleUserSettings = function () {
    "use strict";
    console.log("((handleUserSettings))");

    // Valida si soporta almacenamiento "WebStorage"
    if (typeof Storage !== "undefined") {

        // Si la variable "permissions" existe debe vaciarla y cargarla con nuevo valor
        if (typeof window.permissions !== "undefined") {
            localStorage.removeItem("permissions");
            localStorage.permissions = JSON.stringify(window.permissions); //
        }
    } else {
        console.log("Browser does not support storage");
    }

};

/* 05. Configurador de notificaciones de la aplicacion al estilo grow
------------------------------------------------ */
var handleNotifications = function () {
    notification = $("#notification").data("kendoNotification");
}

/* 06. Configuracion de variable global para la obtencion del "RequestVerificationToken"
------------------------------------------------ */
var handleConfigRequestVerificationToken = function () {
    try {
        window.RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();
    } catch (e) { }
}

/* 07. Configurador de eventos globales para transacciones ajax
------------------------------------------------ */
var handleAjaxGlobalEvents = function () {

    console.log("((handleAjaxGlobalEvents))");
    // Texto por defecto de botones bootstrap
    $.fn.button.Constructor.DEFAULTS.loadingText = "Cargando...";

    // Eventos 
    $(document).ajaxStart(function (e) {
        try {
            var $el = $(e.target.activeElement);
            var isButton = $el.hasClass('btn') || $el.hasClass('k-button') || $el.hasClass('signin-btn');
            var isDisableLoading = $el.hasClass('disable-loading');
            document.body.style.cursor = 'wait';

            if (!isButton || isDisableLoading) {
                return;
            }

            $el.button('loading');

        } catch (ex) {
            console.log(ex);
        }
    });

    $(document).ajaxStop(function (e) {
        try {
            $(document).find(".btn").not('.k-upload-button').button('reset');
            $(document).find(".k-button").not('.k-upload-button').button('reset');
            $(document).find(".signin-btn").not('.k-upload-button').button('reset');
            document.body.style.cursor = 'default';
            //handleLoadingOnLinks();
        } catch (ex) {
            console.log(ex);
        }
    });

    $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
        // Reseteo para botones bootstrap
        $(document).find(".btn").not('.k-upload-button').button('reset');
        $(document).find(".k-button").not('.k-upload-button').button('reset');
        $(document).find(".signin-btn").not('.k-upload-button').button('reset');
        document.body.style.cursor = 'default';

        // Mensajes de notificación para errores ajax no controlados
        if (jqxhr.statusText != undefined && jqxhr.status == 400) {
            notification.show({ message: jqxhr.statusText }, "error");
        } else if (jqxhr.status == 403) {
            notification.show({ message: "Acceso no autorizado a: <i><small>" + settings.url + "</i></small>" }, "error");
        } else if (jqxhr.status == 404) {
            notification.show({ message: "Recurso no encontrado " }, "error");
        } else if (jqxhr.status == 500) {
            notification.show({ message: "No fue posible realizar el proceso solicitado" }, "error");
        } else {
            console.warn("No fue posible realizar el proceso solicitado");
        }

    });

    $(document).ajaxComplete(function (event, request, settings) {
        $(document).find(".btn").not('.k-upload-button').button('reset');
        $(document).find(".k-button").not('.k-upload-button').button('reset');
        $(document).find(".signin-btn").not('.k-upload-button').button('reset');
        document.body.style.cursor = 'default';
    });

}

/* 08. Configurador para botones cuando son links entre paginas
------------------------------------------------ */
function handleLoadingOnLinks() {
    console.log("((handleLoadingOnLinks))");

    // Aplica aquellos links que salten entre paginas internas o externas
    $('#content-wrapper a').not(".disable-loading").click(function (e) {
        var href = $(this).attr('href');
        var target = $(this).attr('target') == null ? null : $(this).attr('target').toLowerCase();
        var isButton = $(this).hasClass("btn") || $(this).hasClass("k-button");

        if (href != "#" &&
            href != "" &&
            href != null &&
            isButton &&
            !e.ctrlKey &&
            (target == null && target != "_blank" && target != "blank")) {

            $(this).button('loading');
        }
    });

    // Links de menu
    $('.navigation').not(".dropdown-second-menu")
        .find("li")
        .not(".mm-dropdown").click(function (e) {

            if (!window.isMenuItemClicked) {
                event.preventDefault();
                var href = $(this).find("a").attr('href');

                if (href != "#") {
                    $(".navigation li").not(".mm-dropdown").removeClass("active");
                    $(this).addClass("active");

                    window.isMenuItemClicked = true;
                    var timer = setInterval(function () {
                        window.location.href = href;
                        clearInterval(timer);
                    }, 80);
                }
            }

        });
}

/* 09. Configurador de icono circular que simboliza la carga inicial
------------------------------------------------ */
function handleLoader() {
    $('#loader').addClass("animated fadeOut");
    $('#loader').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this).hide();
        $("body").css("overflow-x", "auto");
        // ajusta alto de pantalla
        //$("#content-wrapper").css("min-height", $(window).height() + "px");

    });
}

/* 10. Configurador de plugin Pace
------------------------------------------------ */
function handlePace() {
    Pace.on("done", function () {
        handleAjaxModal();
        var timer = setInterval(function () {
            $("#loader").hide();
            clearInterval(timer);
        }, 5000);
    });

    Pace.options.ajax.trackWebSockets = false;
}

/* 11. Configurador de notificacion de pronta finalización de session e inactividad
------------------------------------------------ */
function handleTimeouts() {
    // Actualiza tiempo de inactividad
    updateIdleTimer();
    $(document).ajaxStart(updateIdleTimer);
    $(document).ajaxStop(updateIdleTimer);
    $(document).ajaxError(updateIdleTimer);

    // Actualiza tiempo de session
    var oneMinute = 60 * 1000;
    var sessionTimeoutInMills = window.sessionTimeout * oneMinute;
    var sessionDelay = sessionTimeoutInMills - window.loginTimeElapsedinMills;
    var interval = setInterval(function () {
        if (sessionDelay > 0 && !isNaN(sessionDelay)) {
            window.location.href = "/Account/LogOff";
        } else {
            clearInterval(interval);
        }
    }, sessionDelay);
}

function updateIdleTimer() {
    console.log("((updateIdleTimer))");
    if (idleTimer != null) {
        clearInterval(idleTimer);
        clearInterval(idleCountdownTimer);
    }

    var oneMinute = 60 * 1000;
    var idleDelay = (window.idleTimeout * oneMinute) - oneMinute;

    idleTimer = setInterval(function () {
        if (!isNaN(idleDelay)) {
            var message = "Su sesión esta proxima a vencer ya que no registra actividad";
            notificationDesktop.show({ message: message });
            console.log("idleDelay:" + idleDelay);

            idleCountdownTimer = setInterval(function () {
                window.location.href = "/Account/LogOff/?SessionClosed=True";
            }, oneMinute);
        }

        clearInterval(idleTimer);
    }, idleDelay);
}

/* 12. Configurador del hub notificaciones utilizado de manera transversal en las areas
------------------------------------------------ */
function handleNotificationHub() {
    // Definiciones iniciales
    notificationHub = $.connection.notificationHub; //hub

    // Metodo llamado desde el servidor para mostrar el mensaje
    notificationHub.client.show = function (config) {
        var type = config.Type == 0 ? 'error' :
            config.Type == 1 ? 'success' :
                config.Type == 2 ? 'info' :
                    config.Type == 3 ? 'warn' :
                        config.Type == 4 ? 'modal' :
                            config.Type == 5 ? 'inbox' : "";

        switch (type) {
            case 'error':
            case 'success':
            case 'info':
            case 'warn':
                notification.show({ message: config.Message }, type);
                break;
            case 'modal':
                Utils.showModalBs(config.ModalUrl, "", config.ModalParams);
                break;
            case 'inbox':
                //notification.show({ message: config.Message }, type);
                getCountNewInboxNotifications();
                break;
        }

        // Muestra notificaciones fuera del navegador
        if (config.ShowMessageInDesktop && config.Message != null) {
            if (config.ShowIconInDesktop) {
                type = (type == 'modal') ? '' : type; // para el caso de modales muestra el icono de la DGSM
                notificationDesktop.show({ message: config.Message }, type);
            } else {
                notificationDesktop.show({ message: config.Message });
            }
        }
    };

    $.connection.hub.start().done(function (e) {
        console.log("((Connected signal hub))");
        //notificationHub.server.evalUserExist();
    });

    //$.connection.hub.reconnecting(function() {
    //    console.log("((Reconnecting signal hub))");
    //});

    //$.connection.hub.reconnected(function() {
    //    console.log("((Reconnected signal hub))");
    //});           

    $.connection.hub.disconnected(function () {
        console.log("((Disconnected signal hub))");
        if ($.connection.hub.lastError) {
            console.log("Disconnected. Reason: " + $.connection.hub.lastError.message);
        }

        //setTimeout(function () {
        //    console.log("((Reconnecting signal hub from timeout))");

        //    $.connection.hub.start().done(function () {
        //        console.log("((Connected signal hub from timeout))");

        //    });
        //}, 5000); // Restart connection after 5 seconds.

    });

    notificationHub.client.notifyUserBlocked = function (message) {
        //$.msgbox(message, {
        //    type: "alert",
        //    buttons: []
        //});
    }


    // Metodo que obtiene el conteo de nuevas notificaciones en la bandeja
    var getCountNewInboxNotifications = function () {
        console.log("((GetCountNewInboxNotifications))");

        $.ajax({
            type: "POST",
            url: "/Notification/GetCountNewInboxNotifications/",
            dataType: "json",
            success: function (response) {
                if (response.Success) {
                    if (response.Result) {
                        $("#main-navbar #notificationsCount").text(response.Result);
                    } else {
                        $("#main-navbar #notificationsCount").text("");
                    }
                }
            },
            failure: function (response) {
                console.warn(response.responseText);
            },
            error: function (response) {
                console.error(response.responseText);
            }
        });
    }

    // Metodo que obtiene las ultimas notificaciones registradas
    var getListInboxNotifications = function (action) {
        console.log("((GetLastInboxNotifications))");

        var count;
        switch (action) {
            case "VIEW_ALL":
                count = 50;
                break;

            // AUTO
            default:
                // Obtiene cantidad de notificaciones pendientes
                var count;
                var notificationsCount = $("#main-navbar #notificationsCount");
                if (notificationsCount.text() == "") {
                    count = 0;
                } else {
                    count = notificationsCount.text();
                }
                break;

        }


        // Obtiene lista y resetea cantidad de notificaciones pendientes por revisar
        $.ajax({
            type: "POST",
            data: { count: count },
            url: "/Notification/GetListInboxNotifications/",
            dataType: "json",
            success: function (response) {
                if (response.Success) {
                    // Actualiza conteo de notificaciones por revisar, luego de haber visualizado las actuales
                    getCountNewInboxNotifications();

                    // Actualiza lista de notificaciones
                    var templateContent = $("#main-navbar #notificationListTemplate").html();
                    var template = kendo.template(templateContent);
                    $("#main-navbar #notificationList").html(kendo.render(template, response.Result));
                }
            },
            failure: function (response) {
                console.warn(response.responseText);
            },
            error: function (response) {
                console.error(response.responseText);
            }
        });
    }

    // Obtiene numero de notificaciones nuevas asignadas al usuario especificado
    setTimeout(function () {
        getCountNewInboxNotifications();
    }, 500);

    $("#main-navbar #notificationInboxBtn").on("click", function () {
        getListInboxNotifications();
    });

    $("#main-navbar #notificationsViewAllBtn").on("click", function (e) {
        getListInboxNotifications("VIEW_ALL");
    });

    $("#main-navbar .widget-notifications").on("click", function (e) {
        e.stopPropagation();
    });

}

/* 13. Configurador de placeholder automatico basado en los labels para los campos que lo requieran */
function handleEnablePlaceholder() {
    console.log("((handleEnablePlaceholder))");

    // Habilitación de placeholder para campos especificos
    $("form :input[enable-placeholder]").each(function (index, elem) {
        var eId = $(elem).attr("id");
        var label = null;
        if (eId && (label = $(elem).parents("form").find("label[for=" + eId + "]")).length == 1) {
            $(elem).attr("placeholder", "Ingrese " + $(label).text().toLowerCase());
        }
    });

    // Habilitación de placeholder para formularios completos
    $("form[enable-placeholder] :input").each(function (index, elem) {
        var eId = $(elem).attr("id");
        var label = null;
        var hasPlaceholder = $(elem).attr("placeholder");

        if (eId && (label = $(elem).parents("form").find("label[for=" + eId + "]")).length == 1) {
            // Si no tiene un placeholder definido
            if (typeof hasPlaceholder == "undefined" || hasPlaceholder == false || hasPlaceholder == null) {
                $(elem).attr("placeholder", "Ingrese " + $(label).text().toLowerCase());
            }
        }
    });
}

/* 14. Previene el uso de multiples tabs */
function handlePreventMultipleTabs(removeTabInstance) {
    console.log("((handlePreventMultipleTabs))");

    if (localStorage.getItem("_tabInstance") === null) {
        localStorage.setItem("_tabInstance", true);
        window.onunload = function () {
            localStorage.removeItem("_tabInstance");
        };
    } else {
        alert("No esta permitido el uso de múltiples tabs o ventanas en los módulos de Historia Clínica, esta restricción es temporal y lamentamos los inconvenientes que esto pueda causarle.");
        var win = window.open("about:blank", "_self");
        win.close();
    }

};

/*15. Manejador de localstorage */
function handleLocalStorage() {
    localStorage.clear();
}
/*16. Inicia Particulas */
function initParticles()
{
    particlesJS("particles-js",
        {
            "particles": {
                "number": {
                    "value": 2,
                    "density": {
                        "enable": true,
                        "value_area": 80
                    }
                },
                "color": {
                    "value": ["#ffffff", "#bb73f9", "#76cffb"]
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },

                },
                "opacity": {
                    "value": 0.1,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 250,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": true
                    }
                },
                "line_linked": {
                    "enable": false
                },
                "move": {
                    "enable": true,
                    "speed": .5,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": false,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": false,
                        "mode": "push"
                    },
                    "onresize": {
                        enable: true,
                        density_auto: true,
                        density_area: 80
                    }
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        }
    );
}


/* Application Inits
------------------------------------------------------ */
var Area = function () {
    "use strict"
    return {
        init: function () {
            handleKendoCulture();
            handleNotifications();
            handleConfigRequestVerificationToken();
            handleAjaxGlobalEvents();
            handleLoader();
            handleAjaxModal();
            handleTimeouts();
            handleEnablePlaceholder();
        }
    };
}();

var Login = function () {
    "use strict"
    return {
        init: function () {
            handleKendoCulture();
            handleAjaxGlobalEvents();
            handleLocalStorage();
            initParticles();
        }
    };
}();

var Cpanel = function () {
    "use strict"
    return {
        init: function () {
            handleUserSettings();
            handleTimeouts();
            handleAjaxModal();
            handleNotifications();
            handleNotificationHub();
            handleAjaxGlobalEvents();
            this.enableAjaxCache();
        },

        // se habilita cache para evitar la carga de los scripts adicionales desde los modales
        enableAjaxCache: function () {
            $.ajaxSetup({ cache: true });
        }
    };
}();