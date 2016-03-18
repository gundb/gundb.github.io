
(function(compId) {
    var _ = null,
        y = true,
        n = false,
        x47 = 'RoundRect',
        x18 = '15px',
        x25 = 'rgb(0, 0, 0)',
        x49 = '45px',
        x34 = '25.5px',
        x29 = '51px',
        x44 = '-360',
        e59 = '${Ellipse}',
        i = 'none',
        x38 = '139px',
        x3 = '6.0.0.400',
        x24 = 'Rectangle2',
        x43 = 'Rectangle4',
        lf = 'left',
        x17 = '179px',
        x32 = 'rgba(110,187,123,1.00)',
        x45 = '50px',
        x13 = '0.1',
        e58 = '${Rectangle}',
        x12 = 'auto',
        rbr = 'border-bottom-right-radius',
        e6 = '${iMac3}',
        x7 = 'Pasted2',
        tp = 'top',
        xc = 'rgba(0,0,0,1)',
        x4 = 'rgba(210,107,90,0.00)',
        zy = 'scaleY',
        rz = 'rotateZ',
        e5 = '${iMac2}',
        x14 = 'rgba(0,0,0,0)',
        x42 = '45',
        x20 = 'Rectangle',
        zx = 'scaleX',
        x21 = 'rgba(223,108,29,1.00)',
        x9 = '-1306px',
        x33 = '87px',
        e53 = '${Rectangle2}',
        x36 = '1',
        x48 = '0',
        x56 = '@@0@@px @@1@@px',
        m = 'rect',
        x22 = '177px',
        h = 'height',
        x10 = '3588px',
        x19 = '186px',
        x51 = '359px',
        rtl = 'border-top-left-radius',
        x40 = '46px',
        x35 = 'Ellipse',
        o = 'opacity',
        e57 = '${RoundRect}',
        bg = 'background-color',
        e55 = '${Rectangle4}',
        rbl = 'border-bottom-left-radius',
        x41 = '46px 46px',
        x1 = '6.0.0',
        x2 = '5.0.0',
        x37 = 'ellipse',
        g = 'image',
        x28 = '82px',
        x30 = '-405',
        x50 = 'rgba(73,137,194,1.00)',
        x11 = '2901px',
        x46 = '50px 50px',
        x27 = '154px',
        rtr = 'border-top-right-radius',
        w = 'width',
        x16 = '0px',
        x8 = '-1615px',
        x39 = '100px',
        e54 = '${Rectangle3}',
        x31 = 'Rectangle3',
        x23 = '169px',
        x26 = 'rgba(223,108,29,1)',
        x52 = '290px';
    var g15 = 'Pasted2.svg';
    var im = 'realTime_img/',
        aud = 'media/',
        vid = 'media/',
        js = 'realtime/',
        fonts = {},
        opts = {
            'gAudioPreloadPreference': 'auto',
            'gVideoPreloadPreference': 'auto'
        },
        resources = [],
        scripts = [],
        symbols = {
            "stage": {
                v: x1,
                mv: x2,
                b: x3,
                stf: w,
                cg: i,
                rI: n,
                cn: {
                    dom: [{
                        id: 'iMac2',
                        symbolName: 'iMac',
                        t: m,
                        r: ['133px', '489px', '359', '290', 'auto', 'auto'],
                        tf: [
                            [],
                            [],
                            [],
                            ['0.97602', '0.97602']
                        ]
                    }, {
                        id: 'iMac3',
                        symbolName: 'iMac',
                        t: m,
                        r: ['802px', '490px', 'undefined', 'undefined', 'auto', 'auto'],
                        tf: [
                            [],
                            [],
                            [],
                            ['0.97566', '0.97566']
                        ]
                    }],
                    style: {
                        '${RealTime}': {
                            isStage: true,
                            r: ['null', 'null', '1280px', '800px', 'auto', 'auto'],
                            zr: ['320px', '2560px', '', ''],
                            overflow: 'hidden',
                            f: [x4]
                        }
                    }
                },
                tt: {
                    d: 12500,
                    a: n,
                    data: [
                        ["eid160", zx, 0, 0, "linear", e5, '1.16621', '0.97602'],
                        ["eid163", lf, 0, 0, "linear", e6, '802px', '802px'],
                        ["eid161", zy, 0, 0, "linear", e5, '1.16621', '0.97602'],
                        ["eid159", lf, 0, 0, "linear", e5, '204px', '133px'],
                        ["eid162", tp, 0, 0, "linear", e5, '235px', '489px'],
                        ["eid164", "tr", 0, function(e, d) {
                                this.eSA(e, d);
                            },
                            ['stop', '${iMac3}', []]
                        ],
                        ["eid165", "tr", 750, function(e, d) {
                                this.eSA(e, d);
                            },
                            ['play', '${iMac3}', []]
                        ]
                    ]
                }
            },
            "iMac": {
                v: x1,
                mv: x2,
                b: x3,
                stf: i,
                cg: i,
                rI: n,
                cn: {
                    dom: [{
                        t: g,
                        id: x7,
                        r: [x8, x9, x10, x11, x12, x12],
                        tf: [
                            [],
                            [],
                            [],
                            [x13, x13]
                        ],
                        f: [x14, im + g15, x16, x16]
                    }, {
                        r: [x17, x18, x16, x19, x12, x12],
                        id: x20,
                        s: [0, xc, i],
                        t: m,
                        f: [x21]
                    }, {
                        r: [x22, x18, x23, x19, x12, x12],
                        id: x24,
                        s: [0, x25, i],
                        t: m,
                        f: [x26]
                    }, {
                        r: [x27, x28, x29, x29, x12, x12],
                        br: [x16, x16, x16, x16],
                        tf: [
                            [],
                            [x30],
                            [0, 0, 0],
                            [1, 1, 1]
                        ],
                        id: x31,
                        s: [0, x25, i],
                        t: m,
                        f: [x32]
                    }, {
                        r: [x22, x33, x16, x16, x12, x12],
                        br: [x34, x34, x34, x34],
                        s: [0, x25, i],
                        id: x35,
                        o: x36,
                        t: x37,
                        f: [x32]
                    }, {
                        r: [x38, x39, x16, x16, x12, x12],
                        br: [x40, x40, x40, x41],
                        tf: [
                            [],
                            [x42],
                            [0, 0, 0],
                            [1, 1, 1]
                        ],
                        id: x43,
                        s: [0, x25, i],
                        t: m,
                        f: [x32]
                    }, {
                        tf: [
                            [],
                            [x44],
                            [0, 0, 0],
                            [1, 1, 1]
                        ],
                        br: [x45, x45, x45, x46],
                        id: x47,
                        o: x48,
                        r: [x49, x28, x29, x29, x12, x12],
                        t: m,
                        s: [0, x25, i],
                        f: [x50]
                    }],
                    style: {
                        '${symbolSelector}': {
                            r: [_, _, x51, x52]
                        }
                    }
                },
                tt: {
                    d: 11750,
                    a: y,
                    l: {
                        "intro": 641
                    },
                    data: [
                        ["eid32", lf, 500, 0, "linear", e53, '177px', '177px'],
                        ["eid155", lf, 11500, 0, "linear", e53, '177px', '177px'],
                        ["eid36", lf, 750, 1000, "easeOutQuart", e54, '180px', '154px'],
                        ["eid148", lf, 10250, 1000, "easeOutQuart", e54, '154px', '180px'],
                        ["eid56", rtr, 1358, 1083, "easeOutQuart", e55, [46, 46],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid106", rtr, 5936, 750, "easeOutQuart", e55, [0, 0],
                            [48, 48], {
                                vt: x56
                            }
                        ],
                        ["eid115", rtr, 7750, 500, "easeOutQuart", e55, [48, 48],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid133", rtr, 9750, 1083, "easeOutQuart", e55, [0, 0],
                            [46, 46], {
                                vt: x56
                            }
                        ],
                        ["eid52", bg, 1358, 1083, "easeOutQuart", e55, 'rgba(110,187,123,1.00)', 'rgba(234,158,39,1)'],
                        ["eid88", bg, 3985, 765, "easeOutQuart", e55, 'rgba(234,158,39,1)', 'rgba(110,187,123,1.00)'],
                        ["eid108", bg, 5936, 750, "easeOutQuart", e55, 'rgba(110,187,123,1)', 'rgba(223,108,29,1.00)'],
                        ["eid111", bg, 7500, 250, "easeOutQuart", e55, 'rgba(223,108,29,1)', 'rgba(234,158,39,1.00)'],
                        ["eid127", bg, 9750, 1083, "easeOutQuart", e55, 'rgba(234,158,39,1)', 'rgba(110,187,123,1.00)'],
                        ["eid77", bg, 2893, 907, "easeOutQuart", e57, 'rgba(73,137,194,1)', 'rgba(223,108,29,1.00)'],
                        ["eid101", bg, 6428, 750, "easeOutQuart", e57, 'rgba(223,108,29,1)', 'rgba(110,187,123,1.00)'],
                        ["eid122", bg, 8558, 884, "easeOutQuart", e57, 'rgba(110,187,123,1)', 'rgba(73,137,194,1.00)'],
                        ["eid85", bg, 3560, 750, "easeOutQuart", e54, 'rgba(110,187,123,1)', 'rgba(234,158,39,1.00)'],
                        ["eid94", bg, 5250, 250, "easeOutQuart", e54, 'rgba(234,158,39,1)', 'rgba(73,137,194,1.00)'],
                        ["eid124", bg, 8000, 808, "easeOutQuart", e54, 'rgba(73,137,194,1)', 'rgba(110,187,123,1.00)'],
                        ["eid22", w, 250, 250, "linear", e58, '0px', '167px'],
                        ["eid46", h, 1093, 1083, "easeOutQuart", e59, '0px', '51px'],
                        ["eid136", h, 10000, 1083, "easeOutQuart", e59, '51px', '0px'],
                        ["eid74", rtl, 3322, 478, "easeOutQuart", e57, [50, 50],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid119", rtl, 8558, 884, "easeOutQuart", e57, [0, 0],
                            [94, 94], {
                                vt: x56
                            }
                        ],
                        ["eid76", rbr, 3322, 478, "easeOutQuart", e57, [50, 50],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid121", rbr, 8558, 884, "easeOutQuart", e57, [0, 0],
                            [94, 94], {
                                vt: x56
                            }
                        ],
                        ["eid62", rbr, 1358, 1083, "easeOutQuart", e55, [46, 46],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid107", rbr, 5936, 750, "easeOutQuart", e55, [0, 0],
                            [48, 48], {
                                vt: x56
                            }
                        ],
                        ["eid116", rbr, 7750, 500, "easeOutQuart", e55, [48, 48],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid130", rbr, 9750, 1083, "easeOutQuart", e55, [0, 0],
                            [46, 46], {
                                vt: x56
                            }
                        ],
                        ["eid81", rbl, 3560, 750, "easeOutQuart", e54, [0, 0],
                            [40, 40], {
                                vt: x56
                            }
                        ],
                        ["eid95", rbl, 5500, 750, "easeOutQuart", e54, [40, 40],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid86", rz, 3485, 315, "easeOutQuart", e57, '0deg', '45deg'],
                        ["eid100", rz, 6428, 750, "easeOutQuart", e57, '45deg', '-360deg'],
                        ["eid117", rz, 8558, 884, "easeOutQuart", e57, '-360deg', '360deg'],
                        ["eid83", rtr, 3560, 750, "easeOutQuart", e54, [0, 0],
                            [40, 40], {
                                vt: x56
                            }
                        ],
                        ["eid97", rtr, 5500, 750, "easeOutQuart", e54, [40, 40],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid64", h, 1358, 1083, "easeOutQuart", e55, '0px', '51px'],
                        ["eid131", h, 9750, 1083, "easeOutQuart", e55, '51px', '0px'],
                        ["eid42", h, 750, 1000, "easeOutQuart", e54, '0px', '51px'],
                        ["eid147", h, 10250, 1000, "easeOutQuart", e54, '51px', '0px'],
                        ["eid26", w, 250, 250, "linear", e53, '0px', '169px'],
                        ["eid73", rbl, 3322, 478, "easeOutQuart", e57, [50, 50],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid118", rbl, 8558, 884, "easeOutQuart", e57, [0, 0],
                            [94, 94], {
                                vt: x56
                            }
                        ],
                        ["eid50", bg, 1093, 1083, "easeOutQuart", e59, 'rgba(110,187,123,1)', 'rgba(73,137,194,1.00)'],
                        ["eid135", bg, 10000, 1083, "easeOutQuart", e59, 'rgba(73,137,194,1.00)', 'rgba(110,187,123,1)'],
                        ["eid29", tp, 250, 0, "linear", e53, '15px', '15px'],
                        ["eid30", tp, 500, 0, "linear", e53, '15px', '15px'],
                        ["eid153", tp, 11500, 0, "linear", e53, '15px', '15px'],
                        ["eid40", w, 750, 1000, "easeOutQuart", e54, '0px', '51px'],
                        ["eid149", w, 10250, 1000, "easeOutQuart", e54, '51px', '0px'],
                        ["eid60", rtl, 1358, 1083, "easeOutQuart", e55, [46, 46],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid105", rtl, 5936, 750, "easeOutQuart", e55, [0, 0],
                            [48, 48], {
                                vt: x56
                            }
                        ],
                        ["eid114", rtl, 7750, 500, "easeOutQuart", e55, [48, 48],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid128", rtl, 9750, 1083, "easeOutQuart", e55, [0, 0],
                            [46, 46], {
                                vt: x56
                            }
                        ],
                        ["eid90", o, 1093, 0, "easeOutQuart", e59, '1', '1'],
                        ["eid68", o, 2658, 0, "easeOutQuart", e59, '1', '0'],
                        ["eid151", o, 9442, 0, "easeOutQuart", e59, '0', '1'],
                        ["eid137", o, 11083, 0, "easeOutQuart", e59, '1', '1'],
                        ["eid87", rz, 3985, 765, "easeOutQuart", e55, '45deg', '-450deg'],
                        ["eid103", rz, 5936, 750, "easeOutQuart", e55, '-450deg', '180deg'],
                        ["eid112", rz, 7750, 500, "easeOutQuart", e55, '180deg', '-405deg'],
                        ["eid84", rbr, 3560, 750, "easeOutQuart", e54, [0, 0],
                            [40, 40], {
                                vt: x56
                            }
                        ],
                        ["eid98", rbr, 5500, 750, "easeOutQuart", e54, [40, 40],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid89", o, 0, 0, "easeOutQuart", e57, '0', '0'],
                        ["eid91", o, 2600, 0, "easeOutQuart", e57, '0', '1'],
                        ["eid150", o, 9442, 0, "easeOutQuart", e57, '1', '0'],
                        ["eid44", "location", 1093, 1083, "easeOutQuart", e59, [
                            [221.5, 139.5, 0, 0, 0, 0, 0],
                            [130.99, 150.12, -115.5, -24.61, -114.8, -24.46, 92.04],
                            [70.5, 107.5, 0, 0, 0, 0, 167.67]
                        ]],
                        ["eid138", "location", 10000, 1083, "easeOutQuart", e59, [
                            [70.5, 107.5, 0, 0, 0, 0, 0],
                            [130.99, 150.12, 114.8, 24.46, 115.5, 24.61, 75.63],
                            [221.5, 139.5, 0, 0, 0, 0, 167.67]
                        ]],
                        ["eid82", rtl, 3560, 750, "easeOutQuart", e54, [0, 0],
                            [40, 40], {
                                vt: x56
                            }
                        ],
                        ["eid96", rtl, 5500, 750, "easeOutQuart", e54, [40, 40],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid54", "location", 1358, 1083, "easeOutQuart", e55, [
                            [186.06, 163.94, 0, 0, 0, 0, 0],
                            [204.25, 76.33, 141.6, -78.05, 160.71, -88.58, 100.95],
                            [287.5, 107.5, 0, 0, 0, 0, 199.11]
                        ]],
                        ["eid132", "location", 9750, 1083, "easeOutQuart", e55, [
                            [287.5, 107.5, 0, 0, 0, 0, 0],
                            [204.25, 76.33, -160.71, 88.58, -141.6, 78.05, 98.16],
                            [186.06, 163.94, 0, 0, 0, 0, 199.11]
                        ]],
                        ["eid66", w, 1358, 1083, "easeOutQuart", e55, '0px', '51px'],
                        ["eid134", w, 9750, 1083, "easeOutQuart", e55, '51px', '0px'],
                        ["eid28", h, 250, 0, "linear", e53, '186px', '186px'],
                        ["eid79", bg, 2893, 196, "easeOutQuart", e53, 'rgba(223,108,29,1)', 'rgba(73,137,194,1.00)'],
                        ["eid92", bg, 5250, 250, "easeOutQuart", e53, 'rgba(73,137,194,1)', 'rgba(234,158,39,1.00)'],
                        ["eid110", bg, 7500, 250, "easeOutQuart", e53, 'rgba(234,158,39,1)', 'rgba(223,108,29,1.00)'],
                        ["eid38", tp, 750, 1000, "easeOutQuart", e54, '196px', '82px'],
                        ["eid145", tp, 10250, 1000, "easeOutQuart", e54, '82px', '196px'],
                        ["eid78", bg, 2893, 196, "easeOutQuart", e58, 'rgba(223,108,29,1)', 'rgba(73,137,194,1.00)'],
                        ["eid93", bg, 5250, 250, "easeOutQuart", e58, 'rgba(73,137,194,1)', 'rgba(234,158,39,1.00)'],
                        ["eid109", bg, 7500, 250, "easeOutQuart", e58, 'rgba(234,158,39,1)', 'rgba(223,108,29,1.00)'],
                        ["eid48", w, 1093, 1083, "easeOutQuart", e59, '0px', '51px'],
                        ["eid139", w, 10000, 1083, "easeOutQuart", e59, '51px', '0px'],
                        ["eid75", rtr, 3322, 478, "easeOutQuart", e57, [50, 50],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid120", rtr, 8558, 884, "easeOutQuart", e57, [0, 0],
                            [94, 94], {
                                vt: x56
                            }
                        ],
                        ["eid20", lf, 250, 250, "linear", e58, '179px', '12px'],
                        ["eid34", rz, 750, 1000, "easeOutQuart", e54, '-940deg', '0deg'],
                        ["eid80", rz, 3560, 750, "easeOutQuart", e54, '0deg', '360deg'],
                        ["eid99", rz, 5500, 750, "easeOutQuart", e54, '360deg', '-405deg'],
                        ["eid123", rz, 8000, 808, "easeOutQuart", e54, '-405deg', '90deg'],
                        ["eid146", rz, 10250, 1000, "easeOutQuart", e54, '0deg', '-940deg'],
                        ["eid58", rbl, 1358, 1083, "easeOutQuart", e55, [46, 46],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid104", rbl, 5936, 750, "easeOutQuart", e55, [0, 0],
                            [48, 48], {
                                vt: x56
                            }
                        ],
                        ["eid113", rbl, 7750, 500, "easeOutQuart", e55, [48, 48],
                            [0, 0], {
                                vt: x56
                            }
                        ],
                        ["eid129", rbl, 9750, 1083, "easeOutQuart", e55, [0, 0],
                            [46, 46], {
                                vt: x56
                            }
                        ]
                    ]
                }
            }
        };
    AdobeEdge.registerCompositionDefn(compId, symbols, fonts, scripts, resources, opts);
})("realtime");
(function($, Edge, compId) {
    var Composition = Edge.Composition,
        Symbol = Edge.Symbol;
    Edge.registerEventBinding(compId, function($) {
        //Edge symbol: 'stage'
        (function(symbolName) {
            Symbol.bindSymbolAction(compId, symbolName, "creationComplete", function(sym, e) {});
                console.log('Hello mom');
            //Edge binding end
        })("stage");
        //Edge symbol end:'stage'

        //=========================================================

        //Edge symbol: 'iMac'
        (function(symbolName) {
            Symbol.bindTriggerAction(compId, symbolName, "Default Timeline", 11750, function(sym, e) {
                sym.play('intro');
            });
            //Edge binding end
        })("iMac");
        //Edge symbol end:'iMac'
    });
})(AdobeEdge.$, AdobeEdge, "realtime");