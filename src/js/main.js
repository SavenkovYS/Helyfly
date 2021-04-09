(function() {

    // Показать / Скрыть фотографии в галерее

    function showAllPhotos() {
        const showBtn = document.querySelector('.photoshoot__show-all')
        const photos = document.querySelectorAll('.photoshoot__gallery-item')
        const gallery = document.querySelector('.photoshoot__gallery-list')

        // Скрываем фотографии при загрузке

        const PHOTOS_NUMBER_ON_LOAD = 3

        photos.forEach((photo, i) => {
            if (i > PHOTOS_NUMBER_ON_LOAD) {
                photo.classList.add("photoshoot__gallery-item--hidden")
            } 
        })

        showBtn.addEventListener('click', () => {
            gallery.classList.toggle('photoshoot__gallery-list--shown')
            showBtn.classList.toggle('photoshoot__show-all--shown')

            photos.forEach((photo, i) => {
                if (i > PHOTOS_NUMBER_ON_LOAD) {
                    photo.classList.toggle("photoshoot__gallery-item--hidden")
                } 
            })

            if (gallery.classList.contains('photoshoot__gallery-list--shown')) {
                showBtn.textContent = "Скрыть фото"
            } else {
                showBtn.textContent = "Показать все фото"
            }
        })   
    }

    // Показываем / Скрываем текст при нажатии на "Читать больше"

    function readMore() {
        const descriptionSection = document.querySelector('.about__author-description')
        const servicesSection = document.querySelector('.about__author-services')

        const MAX_DESCRIPTION_LENGTH = 480
        const MAX_SERVICES_LENGTH = 200

        /**
         * Обрезает текст на определенное количество символов
         *
         * @param {Element} section - секция, в которой будет обрезаться текст
         * @param {number} maxLength - длина, больше которой текст будет обрезаться
         * 
         */

        function toggleText(section, maxLength = 300) {
            const paragraphs = section.querySelectorAll('.about__text') 
            const readBtn = section.querySelector('.about__read-more')

            let wordsCounter = 0
            for (let i = 0; i < paragraphs.length; i++) {
                const noSpacesPar = paragraphs[i].textContent.replace(/ +/g, ' ').trim()
                wordsCounter += noSpacesPar.length
    
                if (wordsCounter > maxLength) {
                    const extraWords = wordsCounter - maxLength
                    const paragraphContent = noSpacesPar 
                    
                    function sliceText() {
                        const slicedText = noSpacesPar.slice(0, `-${extraWords}`)
                        paragraphs[i].textContent = slicedText + '...'
    
                        for (let j = i + 1; j < paragraphs.length; j++) {
                            if (paragraphs[j]) {
                                paragraphs[j].style.display = 'none'
                            }  
                        }
                    }
                    
                    sliceText()
                    
                    readBtn.addEventListener('click', function() {
                        if (readBtn.classList.contains('about__read-more--hide')) {
                            readBtn.classList.remove('about__read-more--hide')
                            sliceText()
                            readBtn.textContent = 'Читать еще'
                        } else {
                            readBtn.classList.add('about__read-more--hide')
                            readBtn.textContent = 'Свернуть'
                            paragraphs[i].textContent = paragraphContent
                            for (let j = i + 1; j < paragraphs.length; j++) {
                                paragraphs[j].style.display = 'block'
                            }
                        }
                    })
                    
                    break
                }  
            }
        }
        
        toggleText(descriptionSection, MAX_DESCRIPTION_LENGTH)
        toggleText(servicesSection, MAX_SERVICES_LENGTH)
    }

    // Слайдер галереи для мобильной версии

    function slidePhotos() {       
        const sliderContainer = document.querySelector('.slider')
        const photos = sliderContainer.querySelectorAll('.slider__item')
        let sliderCurrentPosition = sliderContainer.getBoundingClientRect().left
        
        sliderContainer.addEventListener('touchstart', onTouchstart)
        
        function onTouchstart(evt) {
            const initClientX = evt.changedTouches[0].clientX
            const initSliderX = sliderCurrentPosition

            sliderContainer.addEventListener('touchmove', onTouchmove) 
            sliderContainer.addEventListener('touchend', onTouchend)

            function onTouchmove(evt) {
                let newClientX = evt.changedTouches[0].clientX - initClientX + initSliderX

                const maxLeftPosition = document.documentElement.clientWidth / 2
                const maxRightPosition = -(photos[0].offsetWidth * photos.length) + document.documentElement.clientWidth / 2
                
                if (newClientX > maxLeftPosition) {
                    newClientX = maxLeftPosition
                }

                if (newClientX < maxRightPosition) {
                    newClientX = maxRightPosition
                }

                sliderContainer.style.transform = `translateX(${newClientX}px)`

                sliderCurrentPosition = newClientX
            }

            function onTouchend() {
                sliderContainer.removeEventListener('touchmove', onTouchmove)
                sliderContainer.removeEventListener('touchend', onTouchend)
            }
        }
          
        if (window.matchMedia("(min-width: 1000px)").matches) {
            sliderContainer.removeEventListener('touchstart', onTouchstart)
            sliderContainer.style.transform = 'translateX(0px)'
        }

        window.addEventListener('resize', () => {
            if (window.matchMedia("(min-width: 1000px)").matches) {
                sliderContainer.removeEventListener('touchstart', onTouchstart)
                sliderContainer.style.transform = 'translateX(0px)'
            } else {
                sliderContainer.addEventListener('touchstart', onTouchstart)
                sliderCurrentPosition = sliderContainer.getBoundingClientRect().left
            }
        })
    }

    // Открытие / Закрытие модального окна
    
    function toggleModal() {
        const modal = document.querySelector('.modal')
        const overlay = document.querySelector('.overlay')
        const closeBtn = modal.querySelector('.modal__close')
        const bookBtns = document.querySelectorAll('.book-js')

        bookBtns.forEach(btn => {
            btn.addEventListener('click', evt => {
                evt.preventDefault()
                openModal()
            })
        })

        closeBtn.addEventListener('click', () => {
            closeModal()
        })

        overlay.addEventListener('click', function(evt) {
            if (evt.target === this) {
                closeModal()
            }
        })

        function closeModal() {
            modal.classList.add('modal--closed')
            overlay.classList.add('overlay--closed')
        }

        function openModal() {
            modal.classList.remove('modal--closed')
            overlay.classList.remove('overlay--closed')
        }
    }

    // Яндекс карты

    function initMap() {
        let flag = 0
        const LOADING_OFFSET = 500

        function showMap() {
            const scrollY = window.scrollY
            const mapOffset = document.querySelector('#map').getBoundingClientRect().top

            if ((scrollY >= mapOffset - LOADING_OFFSET) && (flag === 0)) {
                ymaps.ready(init);
                function init() {
                    const myMap = new ymaps.Map("map", {

                        center: [55.754897, 37.610539],

                        zoom: 13
                    });

                    myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                        hintContent: 'ул. Большая Никитская',
                        balloonContent: 'Встречаемся тут'
                    })

                    myMap.geoObjects.add(myPlacemark)
                }

                flag = 1
            }
        }

        showMap()

        window.addEventListener('scroll', () => {
            showMap()
        })
    }

    // Слайдер секции "Место встречи" для мобильной версии 

    function slideVenue() {
        const slider = document.querySelector('.venue-slider__container')
        const slides = slider.querySelectorAll('.venue-slider__item')
        const nextBtn = document.querySelector('.venue-slider__arrow--next')
        const prevBtn = document.querySelector('.venue-slider__arrow--prev')
        const paginationBtns = document.querySelectorAll('.venue-slider__pagination-item')
        
        let currentIndex = 0
        const step = 100 / slides.length
        const initValue = (slides.length - 1) / (2 * slides.length) * 100 // Вычисляем начальное смещение слайдера в зависимости от количества слайдов
        slider.style.transform = `translate(${initValue}%)`
        prevBtn.style.display = 'none'

        let transformValue = initValue

        nextBtn.addEventListener('click', () => {
            prevBtn.style.display = 'block'

            paginationBtns[currentIndex].classList.remove('venue-slider__pagination-item--active')
            transformValue -= step
            slider.style.transform = `translate(${transformValue}%)`
            currentIndex = currentIndex + 1
            paginationBtns[currentIndex].classList.add('venue-slider__pagination-item--active')
       
            if (currentIndex + 1 === slides.length) {
                nextBtn.style.display = 'none'
            }
        })

        prevBtn.addEventListener('click', () => {
            nextBtn.style.display = 'block'

            paginationBtns[currentIndex].classList.remove('venue-slider__pagination-item--active')
            transformValue += step
            slider.style.transform = `translate(${transformValue}%)`
            currentIndex = currentIndex - 1
            paginationBtns[currentIndex].classList.add('venue-slider__pagination-item--active')

            if (currentIndex === 0) {
                prevBtn.style.display = 'none'
            }
        })

        paginationBtns.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                paginationBtns[currentIndex].classList.remove('venue-slider__pagination-item--active')
                currentIndex = i
                transformValue = initValue + (-step * currentIndex)
                slider.style.transform = `translate(${transformValue}%)`
                btn.classList.add('venue-slider__pagination-item--active')
            })
        })

        if (window.matchMedia("(min-width: 1000px)").matches) {
            slider.style.transform = 'translate(0%)'
        }

        window.addEventListener('resize', () => {
            if (window.matchMedia("(min-width: 1000px)").matches) {
                slider.style.transform = 'translate(0%)'
            } else {
                slider.style.transform = `translate(${transformValue}%)`
            }
        })   
    }
    
    (function init() {
        showAllPhotos()
        readMore()
        slidePhotos()
        toggleModal()
        initMap()
        slideVenue()
    })()
})()