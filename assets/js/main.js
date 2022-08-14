const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const vm = new Vue({
    el: '#top',
    data: {
        image: null,
        fileName: 'filename.png',
        isSelectedTimbre: false,
        isJunted: false,
        timbreSelected: null,
        fileSelected: "",
        svgImage: `<?xml version="1.0" standalone="no"?>
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="48.000000pt" height="48.000000pt"
                  viewBox="0 0 48.000000 48.000000" preserveAspectRatio="xMidYMid meet">

                  <g transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)" fill="#2fa15c" stroke="none">
                    <path d="M281 250 c-29 -38 -55 -70 -58 -70 -3 0 -23 14 -45 31 -21 17 -42 29
                -45 25 -6 -6 76 -85 89 -86 8 0 128 152 128 163 0 19 -20 1 -69 -63z" />
                  </g>
                </svg>`,
        timbres: [
        ],
        options: [
            { x: 0, y: 0 },
            { x: 0, y: 0 },
            { width: 300, height: 300 },
            { width: 300, height: 300 },
        ],
        lastNum: 0,
        imageSizes: {
            width: 300,
            height: 300
        },
        isAtualizar: false
    },
    created: function () {
        const me = this;

        const BASES_URLS = [
            'https://my-json-server.typicode.com/taffarelxavier/temajairfarias44777',
            'http://192.168.1.4:3000'
        ];

        fetch(`${BASES_URLS[0]}/timbres`, {
            "headers": {
                "accept": "application/json"
            },
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        }).then(response => response.json())
            .then(data => {
                me.timbres = data;
            });
    },
    methods: {
        criar() {
            const me = this;

            if (this.fileSelected) {

                me.isJunted = true;

                mergeImages([
                    {
                        src: me.fileSelected,
                        x: me.options[0].x,
                        y: me.options[0].y,
                        width: me.options[2].width,
                        height: me.options[2].height
                    },
                    {
                        src: me.image,
                        x: me.options[1].x,
                        y: me.options[1].y,
                        width: me.options[3].width,
                        height: me.options[3].height
                    }], {
                    width: me.imageSizes.width,
                    height: me.imageSizes.height,
                    isAtualizar: me.isAtualizar
                }).then(b64 => {
                    document.querySelector('#img').src = b64
                    download.href = b64;
                    download.download = me.fileName;
                    me.isAtualizar = false;
                });
            }
            else {
                alert('Selecione primeiro uma imagem em "Escolher arquivo" do seu dispositivo.')
            }

        },
        sizingImage(ev) {
            let value = ev.target.value;
            if (this.lastNum < value) {
            } else {
            }
            this.lastNum = value;
        },
        changeSizeImage(width, height) {
            this.imageSizes.width = width;
            this.imageSizes.height = height;
            this.options[2].width = width;
            this.options[2].height = height;
            this.options[3].width = width;
            this.options[3].height = height;
            this.isAtualizar = true;
            this.criar();
        },
        changeImage(optionIndex, tipo) {
            const VALUE = 5;
            switch (tipo) {
                case 'up':
                    this.options[optionIndex].y -= VALUE;
                    break;
                case 'right':
                    this.options[optionIndex].x += VALUE;
                    break;
                case 'down':
                    this.options[optionIndex].y += VALUE;
                    break;
                case 'left':
                    this.options[optionIndex].x -= VALUE;
                    break;
            }
            this.criar();
        },
        alterarTamanho(optionIndex, tipo) {
            this.criar();
        },
        selecionarTimbre(timbre) {
            this.isSelectedTimbre = true;
            this.timbreSelected = timbre;
            this.image = timbre.src;
            // if (this.isSelectedTimbre && this.fileSelected) {
            this.criar();
            // }
        },
        async getFile(ev) {
            if (ev.target.files.length) {
                const file = ev.target.files[0];
                this.fileName = file.name.split(".").shift() + ".png"
                this.fileSelected = await toBase64(file);
                if (this.isSelectedTimbre) {
                    this.criar();
                }
            }
        }
    }
});
