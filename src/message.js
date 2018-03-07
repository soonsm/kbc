const locale = require('./locale');

exports.greeting = {
    asker : [
        {
            locale: 'default',
            text: 'Ask about cosmetic surgery.\nThe best doctors in Korea answered.'
        },
        {
            locale: locale.vn,
            text: 'Hãy đặt câu hỏi về phẫu thuật thẩm mỹ.\n'+'Các bác sĩ hàng đầu hàn quốc sẽ trả lời.'
        },
        {
            locale: locale.ch, //간체
            text: '关于整形手术的问题进行提问。\n韩国最好的医生们回答。'
        },
        {
            locale: locale.tw, //번체
            text: '關於整形手術的問題進行提問。\n' + '韓國最好的醫生們回答。'
        },
        {
            locale: locale.hk, //번체
            text: '關於整形手術的問題進行提問。\n' + '韓國最好的醫生們回答。'
        },
        {
            locale: locale.th,
            text: 'ขอถามเกี่ยวกับการศัลยกรรมตกแต่งด้วยค่ะ\n' + 'แพทย์ที่ดีที่สุดของประเทศเกาหลีตอบค่ะ'
        },
        {
            locale: locale.id,
            text: 'Bertanya tentang operasi plastik.\n' + 'Dokter - dokter terbaik di Korea menjawab.'
        },
        {
            locale: locale.ko,
            text: '성형수술에 관해 질문하세요.\n' + '한국 최고의 의사들이 답변합니다.'
        }
    ],
    agency : [
        {
            locale: 'default',
            text: '한국 성형에 관심 있는 사람들을 만나보세요.'
        }
    ]
};

exports.enterAgain = function(loc){
    switch(loc){
        case locale.vn: return 'Vui lòng nhập lại câu hỏi.';
        case locale.ch: return '请重新输入一下提问。';
        case locale.tw || locale.hk: return '請重新輸入一下提問。';
        case locale.th: return 'กรุณาใส่คำถามอีกครั้งค่ะ';
        case locale.id: return 'Silakan masukkan kembali pertanyaannya.';
        case locale.ko: return '질문을 다시 입력해주세요.';
        default: return 'Please re-enter the question.';
    }
};

exports.nativeLanguage = function(loc){
    switch(loc){
        case locale.vn: return 'Tiếng mẹ đẻ';
        case locale.ch: return '母语';
        case locale.tw || locale.hk: return '母語';
        case locale.th: return 'ภาษาแม่';
        case locale.id: return 'Bahasa ibu';
        case locale.ko: return '모국어';
        default: return 'Native language';
    }
};

exports.questionRegistered = function(loc){
    switch(loc){
        case locale.vn: return 'Câu hỏi đã được đăng ký. Nếu bác sĩ trả lời thì tôi sẽ cho biết.';
        case locale.ch: return '已登记提问。 如果医生回答的话会告诉你的。';
        case locale.tw || locale.hk: return '已登記提問。 如果登記的話會告訴你的。';
        case locale.th: return 'คำถามได้ถูกบันทึกไว้แล้วค่ะ ถ้าคำตอบลงทะเบียนแล้วจะแจ้งให้ทราบค่ะ';
        case locale.id: return 'Pertanyaan telah ditanyakan. Saya akan memberitahu jika jawabannya terdaftar.';
        case locale.ko: return '질문이 등록되었습니다. 답변이 등록되면 알려드리겠습니다.';
        default: return 'Question has been registered. I\'ll let you know when the answer is registered.';
    }
};

exports.cancelResponderFix = function(loc){
    switch(loc){
        case locale.vn: return 'Sự huỷ bỏ';
        case locale.ch: return '取消';
        case locale.tw || locale.hk: return '取消指定答辯者';
        case locale.th: return 'การเพิกถอนคำตอบของผู้มีวิจารณญาณ';
        case locale.id: return 'Pencabutan';
        case locale.ko: return '답변자 지정 취소';
        default: return 'Cancel Responder Appointment';
    }
};

exports.cancelResponderAck = function(loc){
    switch(loc){
        case locale.vn: return 'Hủy rồi.';
        case locale.ch: return '取消了。';
        case locale.tw || locale.hk: return '取消指定者被取消。';
        case locale.th: return 'การกำหนดของผู้ตอบถูกยกเลิกแล้วค่ะ';
        case locale.id: return 'Penunjukan calon orang telah dibatalkan.';
        case locale.ko: return '답변자 지정이 취소되었습니다.';
        default: return 'Answer assignment canceled.';
    }
};

exports.wrongAccess = function(loc){
    switch(loc){
        case locale.vn: return 'Là sự tiếp cận sai.';
        case locale.ch: return '错误的接近。';
        case locale.tw || locale.hk: return '錯誤的接近。';
        case locale.th: return 'มันผิดวิธี';
        case locale.id: return 'Ini pendekatan yang salah.';
        case locale.ko: return '잘못된 접근입니다.';
        default: return 'It\'s a wrong approach.\n';
    }
};

exports.languageSelection = function(loc){
    switch(loc){
        case locale.vn: return 'Lựa chọn ngôn ngữ';
        case locale.ch: return '语言选择';
        case locale.tw || locale.hk: return '語言選擇';
        case locale.th: return 'การเลือกทางภาษา';
        case locale.id: return 'Pilihan bahasa';
        case locale.ko: return '언어선택';
        default: return 'Language selection';
    }
};

exports.showAnswer = function(loc){
    switch(loc){
        case locale.vn: return 'Câu trả lời của bác sĩ';
        case locale.ch: return '查看答辩';
        case locale.tw || locale.hk: return '查看答辯';
        case locale.th: return 'การดูด้วยคำตอบ';
        case locale.id: return 'Jawab';
        case locale.ko: return '답변보기';
        default: return 'View the answers';
    }
};

exports.askAgain = function(loc){
    switch(loc){
        case locale.vn: return 'Tôi sẽ hỏi thêm một lần nữa với bác sĩ này.';
        case locale.ch: return '再次向这个医生提问。';
        case locale.tw || locale.hk: return '再次向這個回答者提問';
        case locale.th: return 'ย้อนกลับไปหาผู้ตอบคำถาม';
        case locale.id: return 'Tanyakan pada mereka pertanyaan-pertanyaan ini.';
        case locale.ko: return '이 답변자에게 다시 질문하기';
        default: return 'Ask this respondent another question';
    }
};

exports.enterAsk = function(loc){
    switch(loc){
        case locale.vn: return 'Hãy nhập câu hỏi đi nào.';
        case locale.ch: return '请输入提问。';
        case locale.tw || locale.hk: return '請輸入提問。';
        case locale.th: return 'กรุณากรอกคำถามค่ะ';
        case locale.id: return 'Silahkan masukkan pertanyaan.';
        case locale.ko: return '질문을 입력하세요.';
        default: return 'Please enter a question.';
    }
};

exports.getStart = 'started';

exports.answerArrived = function(loc){
    switch(loc){
        case locale.vn: return 'Câu trả lời đã đến rồi.';
        case locale.ch: return '医生回答了。';
        case locale.tw || locale.hk: return '回答到了。\n提問\n';
        case locale.th: return 'คำตอบมาแล้วครับ\nคำถาม\n';
        case locale.id: return 'Jawabannya datang.\npertanyaan\n';
        case locale.ko: return '답변이 도착했습니다.';
        default: return 'Your reply has arrived.\nQuestion\n';
    }
};

exports.errorMessage = function(loc){
    switch(loc){
        case locale.vn: return 'Tôi đang kiểm tra dịch vụ.';
        case locale.ch: return '暂时进行服务检查。';
        case locale.tw || locale.hk: return '暫時進行服務檢查。';
        case locale.th: return 'กำลังตรวจสอบบริการอยู่ค่ะ';
        case locale.id: return 'Saya sedang memeriksa sementara layanan.';
        case locale.ko: return '잠시 서비스 점검 중 입니다.';
        default: return 'Service is being checked for a few minutes.';
    }
};

exports.answer = function(loc){
    switch(loc){
        case locale.vn: return 'Sự trả lời';
        case locale.ch: return '答辩';
        case locale.tw || locale.hk: return '答辯';
        case locale.th: return 'การตอบ';
        case locale.id: return 'Jawab';
        case locale.ko: return '답변';
        default: return 'Answer';
    }
};

exports.showAgencyInfo = function(loc){
    switch(loc){
        case locale.vn: return 'Xem thông tin của bệnh viện';
        case locale.ch: return '查看答辩者信息';
        case locale.tw || locale.hk: return '查看答辯者信息';
        case locale.th: return 'การรายงานข้อมูลผู้ตอบ';
        case locale.id: return 'Lihatlah infonya.';
        case locale.ko: return '답변자 정보 보기';
        default: return 'View the Answer Information';
    }
};

exports.visitHompage = function(loc){
    switch(loc){
        case locale.vn: return 'Ghé thăm trang chủ';
        case locale.ch: return '访问主页';
        case locale.tw || locale.hk: return '訪問主頁';
        case locale.th: return 'การไปเยี่ยมเว็บไซต์';
        case locale.id: return 'Kunjungan ke situs web';
        case locale.ko: return '홈페이지 방문';
        default: return 'Visit the homepage\n';
    }
};

