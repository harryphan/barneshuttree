
define(['jqueryui','THREE','bhTree','Stats','THREE.TrackballControls','parallel'],function($,THREE,bhtree){

    var camera, scene, renderer,parent, controls,whole,
        projector, teams, mouse = { x: 0, y: 0 }, INTERSECTED,rotate=true;
    var v = new THREE.Vector3();
    var nodes = [];
    var tmpNodes=[];
    var size=10
    $(document).bind('doForce',function(evt, data){
        doForce(data.n,data.node);
    });
    function constructCube(){
        var cube = new THREE.SphereGeometry(size, 4, 4);
        size=10;
        //var tor = new THREE.SphereGeometry(100, 10, 10);
        var mat = new THREE.MeshBasicMaterial( { wireframe: false, color:new THREE.Color( 0xaaaaaa ) } ) ;
        var mesh = new THREE.Mesh(cube, mat);
        return mesh;
    }
    function constructSprite(){
        var mapC = THREE.ImageUtils.loadTexture( "particle.png" );
        var material = new THREE.SpriteMaterial( { map: mapC, color: 0xFFFFFF , transparent:true, blending: THREE.AdditiveBlending} );
        var sprite = new THREE.Sprite( material );
        sprite.scale.set(10,10,1);
        return sprite;
    }

    function init(myNodes, myEdges) {

        camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 1, 20000 );
        camera.position.set( 0, 0, 300 );

        container=$('#container');
        whole=new THREE.Object3D();


        scene = new THREE.Scene();
        scene.add(whole);
        var init=20
        for(var x=0;x<100;x++){
            var cube=constructSprite();
            cube.position.x = Math.random()*200*(Math.pow(-1,Math.floor(1+Math.random()*2)));
            cube.position.y = Math.random()*200*(Math.pow(-1,Math.floor(1+Math.random()*2)));
            cube.position.z = Math.random()*200*(Math.pow(-1,Math.floor(1+Math.random()*2)));
            nodes.push({obj:cube,mass:init,id:x,speed:new THREE.Vector3(0,0,0),collide:[]});
            scene.add(cube);
            init=1+Math.random()*10
        }


        renderer = new THREE.WebGLRenderer();

        renderer.setClearColor( 0x000000 );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.domElement.style.position = 'absolute';
        container.append(renderer.domElement);


        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.append( stats.domElement );
        controls = new THREE.TrackballControls( camera, renderer.domElement );

        controls.rotateSpeed = 0.5;
        controls.addEventListener( 'change', render );


        window.addEventListener( 'resize', onWindowResize, false );
        camera.lookAt( whole.position );
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function onDocumentMouseMove( event ) {

        event.preventDefault();

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    }
    function doForce(n, node) {
        if( n.id != node.id) {
            if (n.leaf) {
                var distance = node.obj.position.distanceTo(new THREE.Vector3(n.point.x, n.point.y, n.point.z));

                doGravity(node, {obj: {position: n.point}, mass: n.mass});
            } else {
                var distance = node.obj.position.distanceTo(new THREE.Vector3(n.centerOfMass.x, n.centerOfMass.y, n.centerOfMass.z));
                var theta = n.width / distance;
                if (theta < .5) {
                    doGravity(node, {obj: {position: n.centerOfMass}, mass: n.mass});
                } else {
                    for (var j in n.children) {
                        if (n.children[j]) {
                            doForce(tmpNodes[n.children[j]], node);
                        }
                    }
                }
            }
        }
    }
    function doGravity(currentNode, otherNode) {
        var sc=new THREE.Vector3();
        var G=50;
        var frame=100000;
        sc.subVectors(currentNode.obj.position, otherNode.obj.position);
        var len = sc.length();
        var acc= ( otherNode.mass * G) / (len * len);
        //currentNode.speed.addScalar(acc);
        sc.multiplyScalar((otherNode.mass * G) / (len * len));
        //sc.addScalar(3);


//            momentum.multiplyScalar(currentNode.mass);
//            sc.add(momentum);
        sc.divideScalar(frame);
        //sc.sub(momentum);
        currentNode.speed.add(sc);
        var momentum= currentNode.speed.clone();
        momentum.multiplyScalar(currentNode.mass);
        momentum.divideScalar(frame);
        currentNode.speed.sub(momentum);
        //currentNode.obj.position.sub(currentNode.speed);
    }
//    function doGravity(currentNode, otherNode) {
//        var sc=new THREE.Vector3();
//        var G=6.67384e-11;
//        var frame=1000;
//        sc.subVectors(currentNode.obj.position, otherNode.obj.position);
//        var len = sc.length();
//        var acc= (( otherNode.mass * G) / (len * len));
//        var neg=(( currentNode.mass * G) / (len * len));
//        sc.divideScalar(frame);
//        var momentum= sc.clone();
//        sc.addScalar(acc);
//        momentum.addScalar(neg*-1);
//
//        currentNode.speed.add(sc);
//        currentNode.speed.add(momentum)
//        //sc.addScalar((otherNode.mass * G) / (len * len));
//        //sc.addScalar(3);
//
//
////            momentum.multiplyScalar(currentNode.mass);
////            sc.add(momentum);
//        //sc.divideScalar(frame);
//        //sc.sub(momentum);
//        //currentNode.speed.add(sc);
////            var momentum= currentNode.speed.clone();
////            momentum.sub();
////            currentNode.speed.sub(momentum);
//        currentNode.obj.position.sub(currentNode.speed);
//    }
    function animate() {




        var points=$.map(nodes, function(o) { return o.obj.position })

        var bbox=new THREE.Box3().setFromPoints(points);
        bhtree.init(bbox.min,bbox.max);
        for(var i in nodes){
            var node= nodes[i];
            bhtree.add(node.obj.position,node.id,node.mass);
        }
        var sc=new THREE.Vector3();
        tmpNodes=bhtree.nodes();
        for(var i in nodes) {
//            for (var j in nodes){
//                if(nodes[i]!=nodes[j])
//                    doGravity(nodes[i],nodes[j])
//            }
            var node=nodes[i];
//            function doForce(n, node) {
//                if (n.leaf && n.id != node.id) {
//                    var distance = node.obj.position.distanceTo(new THREE.Vector3(n.point.x, n.point.y, n.point.z));
//                    doGravity(node, {obj: {position: n.point},mass: n.mass});
//                } else {
//                    var distance = node.obj.position.distanceTo(new THREE.Vector3(n.point.x, n.point.y, n.point.z));
//                    var theta = n.width / distance;
//                    if (theta < .5) {
//                        doGravity(node, {obj: {position: n.centerOfMass},mass: n.mass});
//                    } else {
//                        for (var j in n.children) {
//                            if (n.children[j]) {
//                                doForce(n.children[j], node);
//                            }
//                        }
//                    }
//                }
//            }

            if (bhtree.nodes()) {

                //$(document).trigger('doForce',{n:bhtree.bhRoot(),node:node});
                doForce(tmpNodes[0], node);
            }
        }

        
        for(var i in nodes){
            var node=nodes[i];
            node.obj.position.sub(node.speed);
            addSegment(node.obj.position,node.id);
        }


//        function doGravity(currentNode, otherNode) {
//            var G=6.67384e-11;
//            var frame=1000;
//            sc.subVectors(currentNode.obj.position, otherNode.obj.position);
//            var len = sc.length();
//            var acc= (( otherNode.mass * G) / (len * len))/frame;
//            sc.divideScalar(frame);
//            sc.addScalar(acc);
//            currentNode.speed.add(sc);
//            //sc.addScalar((otherNode.mass * G) / (len * len));
//            //sc.addScalar(3);
//
//
////            momentum.multiplyScalar(currentNode.mass);
////            sc.add(momentum);
//            //sc.divideScalar(frame);
//            //sc.sub(momentum);
//            //currentNode.speed.add(sc);
////            var momentum= currentNode.speed.clone();
////            momentum.multiplyScalar(currentNode.mass);
////            momentum.divideScalar(frame);
////            currentNode.speed.add(momentum);
//            currentNode.obj.position.sub(currentNode.speed);
//        }

        //nodes[1].position.add(sc);
//        for(var i in nodes){
//            nodes[i].position.multiplyScalar(.05);
//        }
//        doAttraction(nodes[0],nodes[1]);
//        doAttraction(nodes[1],nodes[0]);
        requestAnimationFrame( animate );
//
//        var t=scene.getObjectByName('t2');
//        var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
//        var geometry = new THREE.Geometry();
//        if(t){
//            geometry.vertices= t.geometry.vertices;
//            geometry.vertices.push(nodes[1].obj.position.clone());
//            if(geometry.vertices.length > 100){
//                geometry.vertices.shift();
//            }
//            scene.remove(t);
//        }
//
//
//        var line = new THREE.Line( geometry, material );
//        line.geometry.dynamic=true;
//        line.name='t2';
//        scene.add(line);
        render();
        bhtree.clear();
        stats.update();
        controls.update();
    }
    function addSegment(position,id){
        var t=scene.getObjectByName('line'+id);
        var material = new THREE.LineBasicMaterial({ color: 0xffffff });
        var geometry = new THREE.Geometry();
        if(t){
            geometry.vertices= t.geometry.vertices;
            geometry.vertices.push(position.clone());
            if(geometry.vertices.length > 100){
                geometry.vertices.shift();
            }
            scene.remove(t);
        }
        var line = new THREE.Line( geometry, material );
        line.geometry.dynamic=true;
        line.name='line'+id;
        scene.add(line);
    }


    function render() {

//        if(nodes[0]){
//           camera.position.set(nodes[0].obj.position.addScalar(-100));
 //           camera.lookAt( nodes[0].obj.position );
//
//        }
        renderer.render( scene, camera );

    }

    return{
        init:init,
        animate:animate
    }
});
