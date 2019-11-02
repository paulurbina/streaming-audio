$(function () {
    let audio = $('audio')

    function cargarCanciones () {
        $.ajax({
            url: '/canciones'
        }).done(function (canciones) {
            let lista = $('.lista-canciones')
            lista.empty()
            canciones.forEach(function (cancion) {
                let nuevoElemento = $('<li class="cancion">' + cancion.nombre  + '</li>')
                nuevoElemento
                    .on('click', cancion, playFunc)
                    .appendTo(lista)
            });

        }).fail(function () {
            alert('no se pudo cargar las canciones')
        })
    }

    function playFunc(evento) {
        audio[0].pause()
        audio.attr('src', '/canciones/' + evento.data.nombre)
        audio[0].play()
    }
    

    cargarCanciones()
})