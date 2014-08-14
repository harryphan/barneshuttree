define([],function () {
	var x;
   
	var min={x:0,y:0,z:0};
	var max={x:8,y:8,z:8};
	init(min,max);
	function TreeNode(min,max){
		return{
			body:[],
			leaf:true,
			children:[null,null,null,null,null,null,null,null],
			box:[min,max]
		}
	}
	function init(min,max){
		bhRoot=new Treenode(min,max);
	}
	function add(point){
		addNode(bhRoot,point);
	}
	function addNode(node, point){
		if(node.leaf){
		}
	}
});