System.register(["../components/Cell", "../components/Line"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Cell_1, Line_1;
    var Parser;
    return {
        setters:[
            function (Cell_1_1) {
                Cell_1 = Cell_1_1;
            },
            function (Line_1_1) {
                Line_1 = Line_1_1;
            }],
        execute: function() {
            Parser = (function () {
                function Parser() {
                }
                Parser.parse = function (text) {
                    var _this = this;
                    var res = [];
                    if (!text) {
                        console.log("Parse error : received null content");
                        return res;
                    }
                    // on split le fichier par ligne
                    var lineArray = text.split("\n");
                    lineArray = lineArray.map(function (str) { return _this.nettoyage(str); });
                    //on recupere la plus longue des lignes
                    var longestStr = lineArray.reduce(function (a, b) { return a.length > b.length ? a : b; });
                    lineArray.forEach(function (lineStr, lineIndex) {
                        //On cree un nouvel objet Line que l'on popule avec des Cell pour chaque caractere de la ligne du fichier
                        var line = new Line_1.Line(lineIndex, longestStr.length);
                        line.setCells(lineStr.split("").map(function (char, index) { return new Cell_1.Cell(lineIndex, index, char); }));
                        line.complete();
                        res.push(line);
                    });
                    return res;
                };
                Parser.nettoyage = function (line) {
                    if (line.charCodeAt(0) == 13) {
                        line = line.substring(1);
                    }
                    if (line.charCodeAt(line.length - 1) == 13) {
                        line = line.substring(0, line.length - 1);
                    }
                    return line;
                };
                return Parser;
            }());
            exports_1("Parser", Parser);
        }
    }
});
//# sourceMappingURL=Parser.js.map