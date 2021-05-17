{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages."${system}";
      in rec {
       devShell = pkgs.mkShell {
          nativeBuildInputs = with pkgs; [
            nodejs-16_x
            nodePackages.typescript-language-server
            nodePackages.eslint
          ];
        };
      });
}
