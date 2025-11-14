$(function() {
    // 메인 버튼 클릭 시 메인 페이지 이동
    $('.mainBtn').on('click', function() {
        location.href='index.html';
    });
    
    // contact - message box 열기/닫기
    $('.right-btn .rightBtn').on('click', function() {
        if($('.right-section').css('right')==='0px' || $('.right-section').css('right')==='0') {
            $('.right-section').animate({right: '-35%'}, 500);
            $('.right-section').removeClass('open');
            $(this).html('&lt;');
        } else {
            $('.right-section').animate({right: '0'}, 500);
            $('.right-section').addClass('open');
            $(this).html('&gt;');
        }
    });
    
    // 슬라이드
    function setupInfiniteSlide(containerSelector) {
        const $container=$(containerSelector);
        const $ul=$container.find('ul');
        const $images=$ul.find('li');
        
        // 이미지가 로드된 후 계산
        let loadedImages=0;
        // 이미지 로드 완류 카운터

        const totalImages=$images.length/2;
        // 이미지 복제본 고려
        
        $images.find('img').on('load', function() {
            loadedImages++;
            
            if (loadedImages===$images.length) {
                calculateAndSetSlide();
            }
        });
        
        function calculateAndSetSlide() {
            let totalWidth=0;
            
            for (let i=0; i<totalImages; i++) {
                const $img=$images.eq(i).find('img');
                totalWidth+=$img.outerWidth(true)+16;
            }
            
            // CSS 애니메이션
            const animationName=containerSelector.replace('.', '')+'Animation';
            const keyframes= `
                @keyframes ${animationName} {
                    0% {
                        transform: translateX(0);
                    }

                    100% {
                        transform: translateX(-${totalWidth}px);
                    }
                }
            `;
            
            // 스타일 추가
            if (!$('#dynamic-animations').length) {
                $('head').append('<style id="dynamic-animations"></style>');
            }
            $('#dynamic-animations').append(keyframes)
            
            // 애니메이션 적용
            $ul.css({
                'animation': `${animationName} 80s linear infinite`,
                'width': 'auto'
            });

            // 애니메이션 정보를 컨테이너에 저장
            $container.data('animationName', animationName);
            $container.data('totalWidth', totalWidth);
            $container.data('$ul', $ul);

            // 마우스 오버 시 애니메이션 일시정지
            $ul.on('mouseenter', function() {
                $(this).css('animation-play-state', 'paused');
            });

            $ul.on('mouseleave', function() {
                $(this).css('animation-play-state', 'running');
            });
        }
        
        // 이미지가 이미 캐시된 경우를 위한 처리
        $images.find('img').each(function() {
            if (this.complete) {
                $(this).trigger('load');
            }
        });
    }

    // fast button
    $('.fast button').on('mousedown', function() {
        const $container=$(this).closest('.work').find('.img');
        const $ul=$container.find('ul');
        const animationName=$container.data('animationName');
        
        if (animationName) {
            // 현재 애니메이션 위치 계산
            const computedStyle=window.getComputedStyle($ul[0]);
            const matrix=new DOMMatrix(computedStyle.transform);
            const currentX=matrix.m41;
            
            // 전체 이동 거리 계산
            const totalWidth=$container.data('totalWidth') || 0;
            
            // 현재 진행률 계산 (0~1)
            let progress=0;
            if (totalWidth>0) {
                progress=Math.abs(currentX)/totalWidth;
                // Math.abs() >> 절대값 반환
                progress=progress%1;
            }
            
            // 새로운 애니메이션 생성 (현재 위치부터 시작)
            const fastAnimationName=animationName+'Fast';
            const startX=-totalWidth*progress;
            // - : 왼쪽으로 이동 (양수는 오른쪽 이동)
            const endX=startX-totalWidth;
            
            const fastKeyframes= `
                @keyframes ${fastAnimationName} {
                    0% {
                        transform: translateX(${startX}px);
                    }

                    100% {
                        transform: translateX(${endX}px);
                    }
                }
            `;
            
            // 기존 fast 애니메이션 제거 후 새로 추가
            const $style=$('#dynamic-animations');
            let styleContent=$style.html();
            // <style> 태그 안에 들어있는 CSS 코드 전체를 가져옴

            styleContent=styleContent.replace(new RegExp(`@keyframes ${fastAnimationName}[^}]*}[^}]*}`, 'g'), '');
            // 기존에 동일한 이름의 keyframes(애니메이션)가 있다면 제거 >> 빈 문자열로 대체
            // @keyframes fastAnimationName { ... } 전체를 정규식으로 찾아서 제거

            $style.html(styleContent + fastKeyframes);
            // 새로운 fastKeyframes 추가
            // <style> 태그 내 기존과 동일한 이름의 애니메이션 제거 + 새 keyframes(애니메이션) 추기
            
            $ul.css({
                'animation': `${fastAnimationName} 15s linear infinite`,
                'width': 'auto'
            });
        }
    });

    $('.fast button').on('mouseup', function() {
        const $container=$(this).closest('.work').find('.img');
        const $ul=$container.find('ul');
        const animationName=$container.data('animationName');
        
        if (animationName) {
            // 현재 애니메이션 위치 계산
            const computedStyle=window.getComputedStyle($ul[0]);
            const matrix=new DOMMatrix(computedStyle.transform);
            const currentX=matrix.m41;
            
            // 전체 이동 거리 계산
            const totalWidth=$container.data('totalWidth') || 0;
            // 0 : 기본값(계산이 안 된 경우, 값이 없는 경우 0으로 처리)
            
            // 현재 진행률 계산
            let progress=0;
            if (totalWidth>0) {
                progress=Math.abs(currentX)/totalWidth;
                progress=progress%1;
            }
            
            // 새로운 애니메이션 생성 (현재 위치부터 시작)
            const slowAnimationName=animationName+'Slow';
            const startX=-totalWidth*progress;
            const endX=startX-totalWidth;
            
            const slowKeyframes= `
                @keyframes ${slowAnimationName} {
                    0% {
                        transform: translateX(${startX}px);
                    }

                    100% {
                        transform: translateX(${endX}px);
                    }
                }
            `;
            
            // 기존 slow 애니메이션 제거 후 새로 추가
            const $style=$('#dynamic-animations');
            let styleContent=$style.html();
            styleContent=styleContent.replace(new RegExp(`@keyframes ${slowAnimationName}[^}]*}[^}]*}`, 'g'), '');
            $style.html(styleContent+slowKeyframes);
            
            $ul.css({
                'animation': `${slowAnimationName} 80s linear infinite`,
                'width': 'auto'
            });
        }
    });


    // 포트폴리오 페이지 - 사이드바 Work 버튼 클릭
    $('#work01Btn').on('click', function() {
        $("#work01").show();
        $('.pf-main').hide();
        $('#work02, #work03, #work04, #work05, #work06').hide();
        $(this).addClass('selected').siblings().removeClass('selected');

        $('.main').scrollTop(0);

        // 슬라이드 설정
        setTimeout(() => setupInfiniteSlide('.work01-images'), 100);
    });

    $("#work02Btn").on('click', function() {
        $("#work02").show();
        $('.pf-main').hide();
        $("#work01, #work03, #work04, #work05, #work06").hide();
        $(this).addClass('selected').siblings().removeClass('selected');

        $('.main').scrollTop(0);

        // 슬라이드 설정
        setTimeout(() => setupInfiniteSlide('.work02-images'), 100);
    });

    $("#work03Btn").on('click', function() {
        $("#work03").show();
        $('.pf-main').hide();
        $("#work01, #work02, #work04, #work05, #work06").hide();
        $(this).addClass('selected').siblings().removeClass('selected');

        $('.main').scrollTop(0);

        // 슬라이드 설정
        setTimeout(() => setupInfiniteSlide('.work03-images'), 100);
    });

    $("#work04Btn").on('click', function() {
        $("#work04").show();
        $('.pf-main').hide();
        $("#work01, #work02, #work03, #work05, #work06").hide();
        $(this).addClass('selected').siblings().removeClass('selected');

        $('.main').scrollTop(0);

        // 슬라이드 설정
        setTimeout(() => setupInfiniteSlide('.work04-images'), 100);
    });
    
    $("#work05Btn").on('click', function() {
        $("#work05").show();
        $('.pf-main').hide();
        $("#work01, #work02, #work03, #work04, #work06").hide();
        $(this).addClass('selected').siblings().removeClass('selected');

        $('.main').scrollTop(0);

        // 슬라이드 설정
        setTimeout(() => setupInfiniteSlide('.work05-images'), 100);
    });

    $("#work06Btn").on('click', function() {
        $("#work06").show();
        $('.pf-main').hide();
        $("#work01, #work02, #work03, #work04, #work05").hide();
        $(this).addClass('selected').siblings().removeClass('selected');

        $('.main').scrollTop(0);

        // 슬라이드 설정
        setTimeout(() => setupInfiniteSlide('.work06-images'), 100);
    });


    // 포트폴리오 페이지 - 메인 그리드 Work 버튼 클릭
    $(".w01").on('click', function() {
        $("#work01").show();
        $('.pf-main').hide();
        $('#work02, #work03, #work04, #work05, #work06').hide();
        $('#work01Btn').addClass('selected').siblings().removeClass('selected');

        $('.main').scrollTop(0);

        // 슬라이드 설정
        setTimeout(() => setupInfiniteSlide('.work01-images'), 100);
    });

    $(".w02").on('click', function() {
        $("#work02").show();
        $('.pf-main').hide();
        $('#work01, #work03, #work04, #work05, #work06').hide();
        $('#work02Btn').addClass('selected').siblings().removeClass('selected');

        $('.main').scrollTop(0);

        // 슬라이드 설정
        setTimeout(() => setupInfiniteSlide('.work02-images'), 100);
    });

    $(".w03").on('click', function() {
        $("#work03").show();
        $('.pf-main').hide();
        $('#work01, #work02, #work04, #work05, #work06').hide();
        $('#work03Btn').addClass('selected').siblings().removeClass('selected');

        $('.main').scrollTop(0);

        // 슬라이드 설정
        setTimeout(() => setupInfiniteSlide('.work03-images'), 100);
    });

    $(".w04").on('click', function() {
        $("#work04").show();
        $('.pf-main').hide();
        $('#work01, #work02, #work03, #work05, #work06').hide();
        $('#work04Btn').addClass('selected').siblings().removeClass('selected');

        $('.main').scrollTop(0);

        // 슬라이드 설정
        setTimeout(() => setupInfiniteSlide('.work04-images'), 100);
    });
    
    $(".w05").on('click', function() {
        $("#work05").show();
        $('.pf-main').hide();
        $('#work01, #work02, #work03, #work04, #work06').hide();
        $('#work05Btn').addClass('selected').siblings().removeClass('selected');

        $('.main').scrollTop(0);

        // 슬라이드 설정
        setTimeout(() => setupInfiniteSlide('.work05-images'), 100);
    });

    $(".w06").on('click', function() {
        $("#work06").show();
        $('.pf-main').hide();
        $('#work01, #work02, #work03, #work04, #work05').hide();
        $('#work06Btn').addClass('selected').siblings().removeClass('selected');

        $('.main').scrollTop(0);

        // 슬라이드 설정
        setTimeout(() => setupInfiniteSlide('.work06-images'), 100);
    });
    
    // Down 버튼 (포트폴리오 페이지)
    $('.downBtn button').on('click', function() {
        const $visibleWork = $('.work:visible');
        const $mainContainer = $('.main');
        
        if ($visibleWork.length > 0) {
            const workBottom = $visibleWork.offset().top + $visibleWork.outerHeight() - $mainContainer.offset().top;
            console.log('Work section bottom:', workBottom);
            
            $mainContainer.animate({
                scrollTop: workBottom
            }, 700);
        } else {
            const scrollHeight = $mainContainer[0].scrollHeight;
            console.log('Main scroll height:', scrollHeight);
            
            $mainContainer.animate({
                scrollTop: scrollHeight
            }, 700);
        }
    });
    
    // 페이지 로드 시 다크 모드 상태 확인
    if (localStorage.getItem('darkMode') === 'true') {
        $('body').addClass('dark-mode');
        $('.dlBtn').text('Light');
    } else {
        $('body').removeClass('dark-mode');
        $('.dlBtn').text('Dark');
    }

    // 다크 모드 토글
    $('.dlBtn').on('click', function() {
        $('body').toggleClass('dark-mode');
        if ($('body').hasClass('dark-mode')) {
            $(this).text('Light');
            localStorage.setItem('darkMode', 'true');
        } else {
            $(this).text('Dark');
            localStorage.setItem('darkMode', 'false');
        }
    });
});