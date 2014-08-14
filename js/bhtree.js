define([],function () {
	var x;
   
	var testMin={x:0,y:0,z:0};
	var testMax={x:8,y:8,z:8};
	var bhRoot;
	test();
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
	function TreeNode(min,max){
		return{
			point:[],
			leaf:true,
			children:[null,null,null,null,null,null,null,null],
			box:{min:min,max:max}
		}
	}
	function init(min,max){
		bhRoot=new TreeNode(min,max);
	}
	function add(point){
		addNode(bhRoot,point);
	}
	function addNode(node, point){
		if(node.point.length >0){
			console.log(true)
		}else{
			var quadrant=getQuadrant(point,node.box);
		}
	}
	function getQuadrant(point,box){
		var center = {x:(box.min.x + box.max.x)/2.0,y:(box.min.y + box.max.y)/2.0,z:(box.min.z + box.max.z)/2.0}
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
});