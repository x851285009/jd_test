/*
 1. 鼠标移入显示,移出隐藏
 目标: 手机京东, 客户服务, 网站导航, 我的京东, 去购物车结算, 全部商品
 2. 鼠标移动切换二级导航菜单的切换显示和隐藏
 3. 输入搜索关键字, 列表显示匹配的结果
 4. 点击显示或者隐藏更多的分享图标
 5. 鼠标移入移出切换地址的显示隐藏
 6. 点击切换地址tab

 7. 鼠标移入移出切换显示迷你购物车
 8. 点击切换产品选项 (商品详情等显示出来)
 9. 当鼠标悬停在某个小图上,在上方显示对应的中图
 10. 点击向右/左, 移动当前展示商品的小图片
 11. 当鼠标在中图上移动时, 显示对应大图的附近部分区域
 */

$(function () {
    showBig();
    showHide();
    subMenu();
    search();
    share();
    address();
    minicart();
    products();
    mediumImg();
    movePic();
    
    function showBig(){
        //获取小黄块
        var $mask = $('#mask');
        //获取小黄块的宽高
        var maskWidth = $mask.width();
        var maskHeight = $mask.height();
        //获取遮罩层
        var $maskTop = $('#maskTop');
        //获取遮罩层及中图的宽高
        var mimgWidth = $maskTop.width();
        var mimgHeight = $maskTop.height();
        //获取大图和大图的容器
        var $largeImg = $('#largeImg');
        var $largeImgContainer = $('#largeImgContainer');

        $maskTop.hover(function(){
            $mask.show();
            $largeImgContainer.show();
            $largeImg.show();
            //获取中图的SRC
            var srcM = $('#mediumImg').attr('src');
            //大图的src
            var srcL = srcM.replace('m.jpg','l.jpg');
            //设置大图src
            $largeImg.attr('src',srcL);
            //load事件
            $largeImg.on('load',function(){
                //获取大图宽高
                var limgWidth = $largeImg.width();
                var limgHeight = $largeImg.height();
                //设置大图容器的宽高
                $largeImgContainer.css({
                    width : limgWidth/2,
                    height : limgHeight/2
                });
                //小黄点的移动事件
                $maskTop.mousemove(function(e){
                    //初始化鼠标的坐标
                    var left = 0;
                    var top = 0;
                    //获取事件的位置
                    var offsetX = event.offsetX;
                    var offsetY = event.offsetY;
                    //修正鼠标位置
                    left = offsetX - (maskWidth/2);
                    top = offsetY - (maskHeight/2);
                    //判断边界值
                    if(left < 0){
                        left = 0;
                    } else if(left > mimgWidth - maskWidth){
                        left = mimgWidth - maskWidth; 
                    }
                    if(top < 0){
                        top = 0;
                    } else if(top > mimgHeight - maskHeight){
                        top = mimgHeight - maskHeight;
                    }
                    //小黄块最终位置
                    $mask.css({
                        left : left,
                        top : top 
                    });
                    //重left 与 top 控制大图容器的显示内容位置
                    left = -(left/mimgWidth)*limgWidth;
                    top = -(top/mimgHeight)*limgHeight;
                    //设置大图在大图容器内的显示位置
                    $largeImg.css({
                        left : left,
                        top : top
                    });
            });
            });
        },function(){
            $mask.hide();
            $largeImgContainer.hide();
            $largeImg.hide();
        })
    }
//点击向右/左, 移动当前展示商品的小图片
    function movePic(){
        //获取左右按钮
        var $backward = $('#preview>h1>a:first');
        var $forward = $('#preview>h1>a:last');
        //获取图片容器
        var $list = $('#icon_list');
        //获取页面总数
        var imgs = $list.children().length;
        //设置显示图片的个数
        var imgs_show = 5;
        //设置计数器
        var img_sum = 0;
        //设置每个图片移动的宽度
        var img_width = 62;
        //判断下一个按钮是否可点击
        if(imgs > imgs_show){
            $forward.attr('class','forward');
        }
        //下一个按钮逻辑
        $forward.click(function(){
            //获取当前按钮的class状态
            var nowClass = $(this).attr('class');
            if(nowClass !== 'forward_disabled'){
                img_sum++;
                //判断边界值
                if(img_sum === imgs-imgs_show){
                    $forward.attr('class','forward_disabled');
                }
                //下一个点击后修改上一个的样式
                $backward.attr('class','backward');
                $list.css('left',-img_sum*img_width);
            }
        });
        $backward.click(function(){
            var nowClass = $(this).attr('class');
            if(nowClass !== 'backward_disabled'){
                img_sum--;
                //判断边界值
                if(img_sum === 0){
                    $backward.attr('class','backward_disabled');
                }
                //下一个点击后修改上一个的样式
                $forward.attr('class','forward');
                $list.css('left',-img_sum*img_width);
            }
        });

    }
//当鼠标悬停在某个小图上,在上方显示对应的中图
    function mediumImg(){
        $('#icon_list li').hover(function(){
            $(this).children().addClass('hoveredThumb');
            //获取中图
            var $mediumImg = $('#mediumImg');
            // 获取小图的src
            var srcS = $(this).children().attr('src');
            //设置中图src与小图src联动
            var srcM = srcS.replace('.jpg','-m.jpg');
            //设置中图的src
            $mediumImg.attr('src',srcM);
        },function(){
            $(this).children().removeClass('hoveredThumb');
        });
    }
//点击切换产品选项 (商品详情等显示出来)
    function products(){
        $('#product_detail .main_tabs li').click(function(){
            //类似tab切换
            $(this).siblings().removeClass('current');
            $(this).addClass('current');
            //获取当前点击的LI的下标
            var index = $(this).index();
            //获取实际目标元素集合
            var $divs = $('#product_detail>div:not(:first)');
            //默认全部隐藏
            $divs.hide();
            //此时单个目标元素为DOM元素应用DOM方法修改装态
            $divs[index].style.display = 'block';
        });
    }
//鼠标移入移出切换显示迷你购物车
    function minicart(){
        $('#minicart').hover(function(){
            $(this).addClass('minicart');
            $(this).children('div').show();
        },function(){            
            $(this).removeClass('minicart');
            $(this).children('div').hide();
        });
    }
//鼠标移入移出切换地址的显示隐藏点击切换地址tab
    function address(){
        $('#store_select').hover(function(){
            $('#store_content,#store_close').show();
        },function(){
            $('#store_content,#store_close').hide();
        });
        $('#store_close').click(function(){
            $('#store_content,#store_close').hide();
        });
        //简易的tab效果
        $('#store_tabs li').click(function(){
            $(this).siblings().removeClass('hover');
            $(this).addClass('hover');
        });
    }
//点击显示或者隐藏更多的分享图标
    function share(){
        var isOpen = false;
        //控制器设置默认状态
        $('.share_more').click(function(){
            if(!isOpen){
                $(this).children('b').addClass('backword');
                $('#dd').css('width','200px');
                //lt()是倒叙查询
                //取前连个兄弟元素
                $(this).prevAll(':lt(2)').show();
            } else {
                $(this).children('b').removeClass('backword');
                $('#dd').css('width','155px');
                //lt()是倒叙查询获取前面两个兄弟元素
                $(this).prevAll(':lt(2)').hide();
            }
            //修改控制器的状态
            isOpen = !isOpen;
        });
        
    }
//输入搜索关键字, 列表显示匹配的结果
    function search(){
        $('#txtSearch').on('focus keyup',function(){
            //属性值判断状态
            //焦点事件focus 键盘点击事件keyup 失焦事件blur
            //字符串去空格
            var val = $.trim($(this).val());
            if(val){
                $('#search_helper').show();
            }
        }).blur(function(){
            $('#search_helper').hide();
        });
    }
//鼠标移动切换二级导航菜单的切换显示和隐藏
    function subMenu(){
        $('.cate_item').hover(function(){
            //this的运用
            $(this).children('div').show();
        },function(){
            $(this).children('div').hide();
        });
    }
//鼠标移入显示子菜单
    function showHide(){
        $('[name=show_hide]').hover(function () {
            var id = $(this).attr('id');
            //选择器的拼接选择
            $('#'+id+'_items').show();
        },function(){
            var id = $(this).attr('id');
            $('#'+id+'_items').hide();
        });
    }
});




