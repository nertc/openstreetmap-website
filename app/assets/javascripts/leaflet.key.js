L.OSM.key = function (options) {
  const control = L.OSM.sidebarPane(options, "key", "javascripts.key.title", "javascripts.key.title");

  control.onAddPane = function (map, button, $ui) {
    $ui
      .on("show", () => {
        map.on("zoomend", update);
        update();
      })
      .on("hide", () => {
        map.off("zoomend", update);
      });

    map.on("baselayerchange", updateButton);

    updateButton();

    control.onContentLoaded = update;
    $ui.one("show", control.loadContent);

    function updateButton() {
      const disabled = !map.getMapBaseLayer().options.hasLegend;
      button
        .toggleClass("disabled", disabled)
        .attr("data-bs-original-title",
              OSM.i18n.t(disabled ?
                "javascripts.key.tooltip_disabled" :
                "javascripts.key.tooltip"));
    }

    function update() {
      const layerId = map.getMapBaseLayerId(),
            zoom = map.getZoom();

      $("#mapkey [data-layer]").each(function () {
        const data = $(this).data();
        $(this).toggle(
          layerId === data.layer &&
          (!data.zoomMin || zoom >= data.zoomMin) &&
          (!data.zoomMax || zoom <= data.zoomMax)
        );
      });
    }
  };

  return control;
};
