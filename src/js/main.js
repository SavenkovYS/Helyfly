(function() {

    // Показать / скрыть фотографии в галерее

    function showAllPhotos() {
        const showBtn = document.querySelector('.photoshoot__show-all')
        const photos = document.querySelectorAll('.photoshoot__gallery-item')
        const gallery = document.querySelector('.photoshoot__gallery-list')

        photos.forEach((photo, i) => {
            if (i > 3) {
                photo.classList.add("photoshoot__gallery-item--hidden")
            } 
        })

        showBtn.addEventListener('click', () => {
            gallery.classList.toggle('photoshoot__gallery-list--shown')
            showBtn.classList.toggle('photoshoot__show-all--shown')

            photos.forEach((photo, i) => {
                if (i > 3) {
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

    function readMore() {
        const descriptionSection = document.querySelector('.about__author-description')
        const servicesSection = document.querySelector('.about__author-services')

        const MAX_DESCRIPTION_LENGTH = 480
        const MAX_SERVICES_LENGTH = 200

        function toggleText(section, maxLength = 300) {
            const paragraphs = section.querySelectorAll('.about__text')
            const readBtn = section.querySelector('.about__read-more')

            let wordsCounter = 0
            for (let i = 0; i < paragraphs.length; i++) {
                wordsCounter += paragraphs[i].textContent.replace(/ +/g, ' ').trim().length
    
                if (wordsCounter > maxLength) {
                    const extraWords = wordsCounter - maxLength
                    const paragraphContent = paragraphs[i].textContent.replace(/ +/g, ' ').trim()
                    
                    function sliceText() {
                        const slicedText = paragraphs[i].textContent.replace(/ +/g, ' ').trim().slice(0, `-${extraWords}`)
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

    (function init() {
        showAllPhotos()
        readMore()
    })()
})()