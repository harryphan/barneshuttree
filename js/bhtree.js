define([],function () {
	var x;
   
	var testMin={x:0,y:0,z:0};
	var testMax={x:8,y:8,z:8};
	var bhRoot;
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
	function TreeNode(min,max){
        var children = [null,null,null,null,null,null,null,null];
        var leaf = true;
        var box={min:min,max:max};
        var point={};
        function addChild(point){
            var quadrant=getQuadrant(point,box);
            var child=children[quadrant];
            if(child){
                if(child.leaf){
                    var node=new TreeNode(child.box.min,child.box.max);
                    node.leaf=false;
                    var points=[point,child.point];
                    node.addChild(point);
                    node.addChild(child.point);
                    children[quadrant]=node;
                }else{
                    child.addChild(point);
                }

            }else{
                children[quadrant]=createChild(point, quadrant,box);
                leaf=false;
            }
        }
        function createChild(point,quadrant,bbox){
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
                    min={x:bbox.min.x,y:bbox.max.y,z:bbox.min.z}
                    break;
                case 6:
                    max=center;
                    min=bbox.min;
                    break;
                default:
                    max=center;
                    min={x:bbox.max.x,y:bbox.min.y,z:bbox.min.z}
                    break;
            }
            var child=new TreeNode(min,max);
            child.point=point;
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
        return{
            point:point,
            leaf:leaf,
            addChild:addChild,
            box:box,
            children:children
        }
    }
    function init(min,max){
        bhRoot=new TreeNode(min,max);
    }
    function add(point){
        bhRoot.addChild(point);
    }
    function clear(){
        bhRoot={};
    }
    function getRoot(){
        return bhRoot;
    }
    return{
        init:init,
        add:add,
        clear:clear,
        bhRoot:getRoot
    }
});
