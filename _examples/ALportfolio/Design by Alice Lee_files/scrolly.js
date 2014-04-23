  		   $(document).ready(function(){
  			   var $window = $(window);
  			   // parallax 
  		      // var $bgobj = $('.header'); 
  		   	  //    $(window).scroll(function() {
  		      //       var yPos = ($window.scrollTop() / 1.1); 
     		  //           var coords = 0 - yPos + 'px';
  			  //		$bgobj.css("top", coords);
  		      //    }); 
				 
  				 // making bg fade out
  				var $transbg = $('.header'); 	
         				$(window).scroll(function() {
  						var transPos = $window.scrollTop() / 460; 
  						var trans = 1 - transPos;
  						var bylineTrans = 1 - transPos/.65;
  						$transbg.css("opacity",trans);
  						$('.byline').css("opacity",bylineTrans);
  						$('.count').css("opacity",bylineTrans);
        	   			});
  		   	  });
			   		  
  			  // pinning nav
  			   $(window).scroll(function(){
				   
				   
  			      if($(window).scrollTop()>302){
  			            $('.bar').addClass("fixed");
  						$('.bar-bg').addClass("fixed-bg");
  						$('.icons').addClass("fixed-bg");	
						
  			      }
				  
  			      if ($(window).scrollTop()>302 && $(window).scrollTop()<=3500){
	   					$('.lettering').addClass("selected");
	   					$('.product').removeClass("selected");
	   					$('.about').removeClass("selected");
  			      }
				  
  			      else if ($(window).scrollTop()>3500 && $(window).scrollTop()<=5530){
	   					$('.product').addClass("selected");
	   					$('.lettering').removeClass("selected");
	   					$('.about').removeClass("selected");
  			      }
				  
  			      else if ($(window).scrollTop()>5530){
	   					$('.about').addClass("selected");
	   					$('.lettering').removeClass("selected");
	   					$('.product').removeClass("selected");
  			      }
			
				else {
		            $('.bar').removeClass("fixed");
					$('.bar-bg').removeClass("fixed-bg");
					$('.icons').removeClass("fixed-bg");
					$('.lettering').removeClass("selected");
					
					
		      }
  			   });
			   
			  // the problem area
			   

		   
		   
		   
		   
		   