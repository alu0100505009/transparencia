**Mapa web de Transparencia**
===================

Esta web, en la que se muestran diferentes mapas de transparencia de la Comunidad Autónoma de Canarias, ha sido creada como modelo para el Trabajo de Fin de Grado de Informática de la Universidad de La Laguna bajo el título de **"Medidas de mejora de la Transparencia en Canarias - Visualización a través de Mapas Web."**.

La web ha sido creada como posible modelo a seguir en un futuro para la implementación de un control de transparencia basado en etiquetas descritas en la memoria del mismo proyecto.

La estuctura web ha sido creada mediante [**Bootstrap 3**](http://getbootstrap.com/), incluyendo los mapas generados con [**Leaflet**](http://leafletjs.com/), una libreria Java Script gratuita para la implementación de mapas. Por otra parte la información que recogen los mapas ha sido implementada mediante tablas de <i class="icon-provider-gdrive"></i> **Google Drive** publicadas en la web mediante Google Spreadsheet, lo que permite a la libreria [**Tabletop.js**](https://github.com/jsoma/tabletop).


----------


Bugs Conocidos
-------------

Actualmente se han encontrado varios bugs consecuencia de fusionar Bootstrap 3 y Leaflet, en los cuales se está trabajando para darle solución.

> **Lista de Bugs:**

> - El menú desplegable deja de funcionar cuando se hace click sobre algun municipio del mapa.

