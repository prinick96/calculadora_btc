/**
 * Alias de number_format(,2,'.',',') de php
 * 
 * @param {*} nStr 
 */
function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? ',' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + '.' + '$2');
	}
	return x1 + x2;
}

/**
 * Obtiene la tasa cada vez que se actualiza un input
 */
function getChanges() {
    return {
        'btc_to_usd' : $('#btc_to_usd').val(),
        'btc_to_clp' : $('#btc_to_clp').val(),
        'usd_to_bsf' : $('#usd_to_bsf').val()
    }
}

/**
 * Hace el cambio de todas las monedas basandose en el bitcoin
 */
function changeBTC() {
    var exchange = getChanges();
    var btc = $('#btc-value').val();

    $('#usd-value').val(btc * exchange.btc_to_usd);
    $('#clp-value').val(btc * exchange.btc_to_clp);
    $('#vef-value').val(btc * exchange.usd_to_bsf);
}

/**
 * Hace el cambio de todas las monedas cuando se acciona el CLP
 */
function changeCLP() {
    var exchange = getChanges();
    var clp = $('#clp-value').val();

    $('#btc-value').val(clp / exchange.btc_to_clp);
    changeBTC();
}

/**
 * Hace el cambio de todas las monedas cuando se acciona el USD
 */
function changeUSD() {
    var exchange = getChanges();
    var usd = $('#usd-value').val();

    $('#btc-value').val(usd / exchange.btc_to_usd);
    changeBTC();
}

/**
 * Hace el cambio de todas las monedas cuando se acciona el BSF
 */
function changeBSF() {
    var exchange = getChanges();
    var bsf = $('#vef-value').val();

    $('#btc-value').val(bsf / exchange.usd_to_bsf);
    changeBTC();
}

/**
 * Obtiene el precio del dólar en bolívares desde dolartoday, y realiza la conversión
 * directamente hacia el equivalente en bitcoins.
 */
function dolartoday() {
    $.ajax({
        type : "GET",
        url : "https://s3.amazonaws.com/dolartoday/data.json",
        success : function(json) {
          var usd_value = json.USD.transferencia * $('#usd-value').val();
          $('#usd_to_bsf').val(usd_value);
          $('#vef-value').val(usd_value);
        }
    });
}

/**
 * Obtiene información del precio en USD y CLP desde coinmarketcap
 */
function coinmarket() {
    $.ajax({
        type : "GET",
        url : "https://api.coinmarketcap.com/v1/ticker/bitcoin/?convert=CLP",
        success : function(json) {
            $('#btc_to_usd').val(json[0].price_usd);
            $('#btc_to_clp').val(json[0].price_clp);
            $('#usd-value').val(json[0].price_usd);
            $('#clp-value').val(json[0].price_clp);
            $('#static-clp-value').html(addCommas(json[0].price_clp));
            dolartoday();
        }
    });
}

/**
 * Inicialización de las llamadas a las api
 */
coinmarket();