// Generated by CoffeeScript 1.7.0
(function() {
  var Gamemode, Inventory, ItemPile;

  ItemPile = require('itempile');

  Inventory = require('inventory');

  module.exports = function(game, opts) {
    return new Gamemode(game, opts);
  };

  module.exports.pluginInfo = {
    loadAfter: ['voxel-mine', 'voxel-carry', 'voxel-fly', 'voxel-registry', 'voxel-harvest']
  };

  Gamemode = (function() {
    function Gamemode(game, opts) {
      var _ref, _ref1;
      this.game = game;
      if (!this.game.isClient) {
        return;
      }
      if (this.game.buttons.down == null) {
        throw 'voxel-gamemode requires game.buttons as kb-bindings (vs kb-controls), cannot add down event listener';
      }
      this.mode = (_ref = opts.startMode) != null ? _ref : 'survival';
      this.registry = (function() {
        var _ref2;
        if ((_ref1 = (_ref2 = this.game.plugins) != null ? _ref2.get('voxel-registry') : void 0) != null) {
          return _ref1;
        } else {
          throw 'voxel-gamemode requires "voxel-registry" plugin';
        }
      }).call(this);
      this.enable();
    }

    Gamemode.prototype.enable = function() {
      var carry, _ref, _ref1;
      carry = (_ref = this.game.plugins) != null ? _ref.get('voxel-carry') : void 0;
      if (carry) {
        this.survivalInventory = new Inventory(carry.inventory.width, carry.inventory.height);
        this.creativeInventory = new Inventory(carry.inventory.width, carry.inventory.height);
      }
      if (((_ref1 = this.game.plugins) != null ? _ref1.isEnabled('voxel-fly') : void 0) && this.mode === 'survival') {
        this.game.plugins.disable('voxel-fly');
      }
      return this.game.buttons.down.on('gamemode', this.onDown = (function(_this) {
        return function() {
          var playerInventory, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8;
          playerInventory = (_ref2 = _this.game.plugins.get('voxel-carry')) != null ? _ref2.inventory : void 0;
          if (_this.mode === 'survival') {
            _this.mode = 'creative';
            _this.game.plugins.enable('voxel-fly');
            if ((_ref3 = _this.game.plugins.get('voxel-mine')) != null) {
              _ref3.instaMine = true;
            }
            if ((_ref4 = _this.game.plugins.get('voxel-harvest')) != null) {
              _ref4.enableToolDamage = false;
            }
            _this.populateCreative();
            if (_this.survivalInventory != null) {
              if (playerInventory != null) {
                playerInventory.transferTo(_this.survivalInventory);
              }
            }
            if (playerInventory != null) {
              if ((_ref5 = _this.creativeInventory) != null) {
                _ref5.transferTo(playerInventory);
              }
            }
            return console.log('creative mode');
          } else {
            _this.mode = 'survival';
            _this.game.plugins.disable('voxel-fly');
            if ((_ref6 = _this.game.plugins.get('voxel-mine')) != null) {
              _ref6.instaMine = false;
            }
            if ((_ref7 = _this.game.plugins.get('voxel-harvest')) != null) {
              _ref7.enableToolDamage = true;
            }
            if (_this.creativeInventory != null) {
              if (playerInventory != null) {
                playerInventory.transferTo(_this.creativeInventory);
              }
            }
            if (playerInventory != null) {
              if ((_ref8 = _this.survivalInventory) != null) {
                _ref8.transferTo(playerInventory);
              }
            }
            return console.log('survival mode');
          }
        };
      })(this));
    };

    Gamemode.prototype.disable = function() {
      return this.game.buttons.down.removeListener('gamemode', this.onDown);
    };

    Gamemode.prototype.populateCreative = function() {
      var i, name, props, registry, _i, _len, _ref, _ref1, _ref2, _results;
      registry = (_ref = this.game.plugins) != null ? _ref.get('voxel-registry') : void 0;
      if (registry != null) {
        i = 0;
        _ref1 = registry.itemProps;
        for (name in _ref1) {
          props = _ref1[name];
          this.creativeInventory.set(i, new ItemPile(name, Infinity));
          i += 1;
        }
        _ref2 = registry.blockProps;
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          props = _ref2[_i];
          if (props.name != null) {
            this.creativeInventory.set(i, new ItemPile(props.name, Infinity));
            _results.push(i += 1);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };

    return Gamemode;

  })();

}).call(this);
