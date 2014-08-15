define([],function () {
	var x;
   
	var testMin={x:0,y:0,z:0};
	var testMax={x:8,y:8,z:8};
	var bhRoot;
	var nodes=[];
	function test(){
		init(testMin,testMax);
		var testPoint={x:7,y:7,z:7};
		var answer=getQuadrant(testPoint,bhRoot.box);
		console.log(answer==0);
		var testPoint={x:3,y:7,z:7};
		var answer=getQuadrant(testPoint,bhRoot.box);
		console.log(answer==1);
		var testPoint={x:3,y:3,z:7};
		var answer=getQuadrant(testPoint,bhRoot.box);
		console.log(answer==2);
		var testPoint={x:7,y:3,z:7};
		var answer=getQuadrant(testPoint,bhRoot.box);
		console.log(answer==3);
		var testPoint={x:7,y:7,z:3};
		var answer=getQuadrant(testPoint,bhRoot.box);
		console.log(answer==4);
		var testPoint={x:3,y:7,z:3};
		var answer=getQuadrant(testPoint,bhRoot.box);
		console.log(answer==5);
		var testPoint={x:3,y:3,z:3};
		var answer=getQuadrant(testPoint,bhRoot.box);
		console.log(answer==6);
		var testPoint={x:7,y:3,z:3};
		var answer=getQuadrant(testPoint,bhRoot.box);
		console.log(answer==7);
	}
	function test2(){
		init(testMin,testMax);
		var testPoint={x:7,y:7,z:7};
		console.log(createChild(testPoint,0,bhRoot.box));
	}
	function test3(){
		var t = TreeNode(testMin,testMax);
		var testPoint={x:7,y:7,z:7};
		t.addChild(testPoint);
		var testPoint={x:1,y:1,z:1};
		t.addChild(testPoint);
		var testPoint={x:5,y:5,z:5};
		t.addChild(testPoint);
		console.log(t);
	}
	function test4(){
		init(testMin,testMax);
		var testPoint={x:7,y:7,z:7};
		add(testPoint);
		var testPoint={x:1,y:1,z:1};
		add(testPoint);
		var testPoint={x:5,y:5,z:5};
		add(testPoint);
		console.log(t);
	}
	function saveNode(n){
        nodes.push(n);
    }
    function saveNode(n){
        nodes.push(n);
    }
    function TreeNode(min,max){
        var children = [null,null,null,null,null,null,null,null];
        var leaf = true;
        var box={min:min,max:max};
        var point={};
        var centerOfMass=null;
        var mass=0;
        var width=Math.abs(min.x-max.x);
        function addChild(point,id,mass){

            var quadrant=getQuadrant(point,box);
            var child=children[quadrant];
            if(child){
                if(child.leaf){
                    var node=new TreeNode(child.box.min,child.box.max);
                    node.leaf=false;
                    var c1=node.addChild(point,id,mass);
                    var c2=node.addChild(child.point,child.id,child.mass);
                    this.mass+=c1.mass;
                    children[quadrant]=node;
                }else{

                    child.addChild(point,id,mass);
                    this.mass+=nodes[id].mass;
                }

            }else{
                child=createChild(point, quadrant,box,id,mass);
                children[quadrant]=child;
                this.leaf=false;
                this.mass+=child.mass;
            }
            if(this.centerOfMass){
                this.centerOfMass={
                    x:(this.centerOfMass.x*mass + children[quadrant].centerOfMass.x*child.mass)/(mass+children[quadrant].mass),
                    y:(this.centerOfMass.y*mass + children[quadrant].centerOfMass.y*child.mass)/(mass+children[quadrant].mass),
                    z:(this.centerOfMass.z*mass + children[quadrant].centerOfMass.z*child.mass)/(mass+children[quadrant].mass)
                };
            }else {
                this.centerOfMass = children[quadrant].point;
            }

            return children[quadrant];
        }
        function createChild(point,quadrant,bbox,id,mass){
            var center = {
                x:(bbox.min.x + bbox.max.x)/2.0,
                y:(bbox.min.y + bbox.max.y)/2.0,
                z:(bbox.min.z + bbox.max.z)/2.0
            };
            switch(quadrant){
                case 0:
                    max=bbox.max;
                    min=center;
                    break;
                case 1:
                    min=center;
                    max={x:bbox.min.x,y:bbox.max.y,z:bbox.max.z};
                    break;
                case 2:
                    min=center;
                    max={x:bbox.min.x,y:bbox.min.y,z:bbox.max.z};
                    break;
                case 3:
                    min=center;
                    max={x:bbox.max.x,y:bbox.min.y,z:bbox.max.z};
                    break;
                case 4:
                    min={x:bbox.max.x,y:bbox.max.y,z:bbox.min.z};
                    max=center;
                    break;
                case 5:
                    max=center;
                    min={x:bbox.min.x,y:bbox.max.y,z:bbox.min.z};
                    break;
                case 6:
                    max=center;
                    min=bbox.min;
                    break;
                default:
                    max=center;
                    min={x:bbox.max.x,y:bbox.min.y,z:bbox.min.z};
                    break;
            }
            var child=new TreeNode(min,max);
            child.point=point;
            child.centerOfMass=point;
            child.mass=mass;
            child.id=id;
            saveNode(child);
            return child;
        }
        function getQuadrant(point,box){
            var center = {x:(box.min.x + box.max.x)/2.0,y:(box.min.y + box.max.y)/2.0,z:(box.min.z + box.max.z)/2.0};
            if (point.z > center.z ){
                if(point.y>center.y){
                    if(point.x > center.x){
                        return 0
                    }
                    else{
                        return 1
                    }
                }else{
                    if(point.x > center.x){
                        return 3
                    }
                    else{
                        return 2
                    }
                }
            }else{
                if(point.y>center.y){
                    if(point.x > center.x){
                        return 4
                    }
                    else{
                        return 5
                    }
                }else{
                    if(point.x > center.x){
                        return 7
                    }
                    else{
                        return 6
                    }
                }
            }
        }
        function getMass(){
            return mass;
        }
        function getCenterOfMass(){
            return centerOfMass;
        }
        return{
            point:point,
            leaf:leaf,
            addChild:addChild,
            box:box,
            children:children,
            centerOfMass:centerOfMass,
            mass:mass,
            width:width
        }
    }
    function init(min,max){
        bhRoot=new TreeNode(min,max);
    }
    function add(point,id,mass){
        bhRoot.addChild(point,id,mass);
    }
    function clear(){
        bhRoot={};
        nodes=[];
    }
    function getRoot(){
        return bhRoot;
    }
    function getNodes(){
        return nodes;
    }
    return{
        init:init,
        add:add,
        clear:clear,
        bhRoot:getRoot,
        nodes:getNodes
    }
});
