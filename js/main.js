require.config({
    baseUrl: 'js',
    shim: {
        jqueryui: {
            exports: '$',
            deps: ['jquery']
        },
        THREE: {
            exports: 'THREE'
        },
        TWEEN: {
            exports: 'TWEEN'
        },
        'THREE.TrackballControls':['THREE'],
        'THREE.RenderPass':['THREE'],
        'THREE.BloomPass':['THREE'],
        'THREE.ShaderPass':['THREE'],
        'THREE.MaskPass':['THREE'],
        'THREE.EffectComposer':['THREE'],
        'THREE.CopyShader':['THREE'],
        'THREE.ConvolutionShader':['THREE'],
        'THREE.FXAAShader':['THREE'],
        'THREE.CSS3DRenderer':['THREE'],
        'THREE.Octree':['THREE'],
        Detector:{
            exports: 'Detector'
        },
        dat:{
            exports:'dat'
        }
    },
    paths: {
        jquery: 'third_party/jquery-core-1.10.2/js/jquery-1.10.2',
        jqueryui: 'third_party/jquery-ui-1.10.2/ui/jquery-ui',
        THREE:'threejs/three',
        TWEEN:'threejs/libs/tween.min',
        'THREE.TrackballControls':'threejs/controls/TrackballControls',
        'THREE.RenderPass':'threejs/postprocessing/RenderPass',
        'THREE.BloomPass':'threejs/postprocessing/BloomPass',
        'THREE.ShaderPass':'threejs/postprocessing/ShaderPass',
        'THREE.MaskPass':'threejs/postprocessing/MaskPass',
        'THREE.EffectComposer':'threejs/postprocessing/EffectComposer',
        'THREE.CopyShader':'threejs/shaders/CopyShader',
        'THREE.ConvolutionShader':'threejs/shaders/ConvolutionShader',
        'THREE.FXAAShader':'threejs/shaders/FXAAShader',
        'THREE.CSS3DRenderer':'threejs/renderers/CSS3DRenderer',
        'THREE.Octree':'threejs/threeoctree',
        Stats:'threejs/libs/stats.min',
        dat:'threejs/dat.gui.min',
        Detector:'threejs/Detector'
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['bhtree']);
