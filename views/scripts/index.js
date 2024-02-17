       $('#mainmenu a').on('mouseover', function(event){
       $('#mainmenu a').removeClass('active');
       $(this).addClass('active');
    })
    $('#mainmenu a').on('mouseout', function(event){
      $('#mainmenu a').removeClass('active'); 
    })
    let timerToggle = false; 
    let currentImg = $('.mainimg img:nth-child(1)');
    let leftMove = 0; 
    let currentMove = 1; 

    
    const imgMoveHandle = ()=>{ // 파라미터
      $('.change img').eq(leftMove).stop()
            .animate({left:'-100%'}, 400, 'linear', function(){
                  $(this).css('left', '100%')
            }); // 0, 1, 2
      $('.change img').eq(currentMove%3).stop().animate({left:0}, 400, 'linear', function(){
            leftMove = currentMove%3; 
      }); // 1, 2, 0
    }

    
    $('.mainimg ul li').on('mouseover', function(){
        timerToggle = true;
        if( timerToggle ){
           clearInterval(timer);
        }
        
        currentMove = $(this).index();
        imgMoveHandle();
    })

    let timer ;
    $('.mainimg ul li').on('mouseout', function(){
        timerToggle = false;
        /*if( !timerToggle ){
          timer = setInterval(()=>{
            imgMoveHandle(currentMove);
          }, 3000)
       } */
    })
    

    // $('.mainimg ul li').eq(0).trigger('mouseover');
    // 0 이미지를 표시

    
    timer = setInterval(()=>{
      if( !timerToggle ){
        imgMoveHandle();
      }

      currentMove++; // 자동으로 돌릴때 
    }, 2000)