
define(['THREE'],function(THREE){
    var bhRoot;
    var nodes=[];

    function TreeNode(min,max){
        var children = [null,null,null,null,null,null,null,null];
        var leaf = true;
        var box={min:min,max:max};
        var point={};
        var centerOfMass=null;
        var mass=0;
        var width=0;
        var x= Math.abs(min.x-max.x);
        var y= Math.abs(min.y-max.y);
        var z= Math.abs(min.z-max.z);
        if(x>y){
            if(x>z){
                width=x;
            }
            else{
                width= z;
            }
        }else{
            if(y>z){
                width= y;
            }else{
                width= z;
            }
        }
        return{
            point:point,
            leaf:leaf,
            box:box,
            children:children,
            centerOfMass:centerOfMass,
            mass:mass,
            width:width
        }
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
        return child;
    }
    function init(min,max){
        //bhRoot=new TreeNode(min,max);
        nodes.push(new TreeNode(min,max));
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
    function addToTree(root,point,id,mass){
        var box = root.box;
        var quadrant=getQuadrant(point,box);
        var childId=root.children[quadrant];
        var child;
        if(childId!=null)
            child=nodes[childId];
        if(child){
            if(child.leaf){
                var node=new TreeNode(child.box.min,child.box.max);
                node.leaf=false;
                nodes.push(node);
                childId=nodes.length-1;
                var c1=addToTree(node,point,id,mass);
                var c2=addToTree(node,child.point,child.id,child.mass);
                root.mass+=mass;
                root.children[quadrant]=childId;
            }else{
                addToTree(child,point,id,mass)
                //child.addChild(point,id,mass);
                root.mass+=mass;
            }

        }else{
            child=createChild(point, quadrant,box,id,mass);
            nodes.push(child);
            childId=nodes.length-1;
            root.children[quadrant]=childId;
            root.leaf=false;
            root.mass+=child.mass;
        }
        if(root.centerOfMass){
            root.centerOfMass={
                x:(root.centerOfMass.x*mass + nodes[root.children[quadrant]].centerOfMass.x*nodes[root.children[quadrant]].mass)/(mass+nodes[root.children[quadrant]].mass),
                y:(root.centerOfMass.y*mass + nodes[root.children[quadrant]].centerOfMass.y*nodes[root.children[quadrant]].mass)/(mass+nodes[root.children[quadrant]].mass),
                z:(root.centerOfMass.z*mass + nodes[root.children[quadrant]].centerOfMass.z*nodes[root.children[quadrant]].mass)/(mass+nodes[root.children[quadrant]].mass)
            };
        }else {
            root.centerOfMass = nodes[root.children[quadrant]].point;
        }

    }
    function add(point,id,mass){
        addToTree(nodes[0],point,id,mass);
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
})
