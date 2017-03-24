require(["jquery", "base/js/namespace"], function($, Jupyter) {
  var Autoplay = function() {
    this.interval = null;
    this.paused = false;
  };

  Autoplay.prototype.step = function() {
    // don't do anything if explicitly paused
    // or another window has focus
    if (!document.hasFocus()) {
      console.debug("autoplay: out of focus");
      return;
    }
    var nb = Jupyter.notebook;
    if (nb.keyboard_manager.mode === "edit") {
      // don't auto-execute while a cell is being edited
      console.debug("autoplay: in edit mode");
      return;
    }
    if (
      nb.get_selected_index() + 1 === nb.ncells() &&
      nb.get_selected_cell().get_text().trim() === ""
    ) {
      // at the end
      console.debug("autoplay: at end");
    } else {
      Jupyter.notebook.execute_cell_and_select_below();
    }
  };

  Autoplay.prototype.stop = function() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  };

  Autoplay.prototype.start = function(ms) {
    ms = ms || 5000;

    this.stop();
    this.pasued = false;
    var that = this;
    this.interval = setInterval(
      function() {
        that.step();
      },
      ms,
    );
  };

  if (window.autoplay) {
    window.autoplay.stop();
  }
  window.autoplay = new Autoplay();
  window.autoplay.start();
  return {
    Autoplay: Autoplay,
  };
});
