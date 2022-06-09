{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
  };

  outputs = { self, nixpkgs, flake-utils, flake-compat }: 
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in rec {
        packages = flake-utils.lib.flattenTree {
          cube-painter = pkgs.stdenv.mkDerivation {
            name = "cube-painter";
            version = "0.0.1";
            src = ./.;
            builder = ./builder.sh;
            buildInputs = with pkgs; [ nodejs ];
          };
        };

        defaultPackage = packages.cube-painter;
      }
    );
}