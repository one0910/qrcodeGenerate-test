import { useEffect, useState,useRef } from 'react';
import QRCode from 'qrcode.react';
import axios from "axios"
const api = 'https://api.unsplash.com/search/photos/';
const accessKey = 'tDtOQmvm838aBhoUi_8KnkXmDJeK7hXIw7g6M-CQuas';


const Loading = ({isLoading}) =>{
  return (
    <div className="loading" style={{
      display:isLoading? "flex":"none"
    }}>
      <div className="spinner-border" role="status">
        <span className="sr-only"></span>
      </div>
    </div>
  )
}


function App() {
  const [qrValue, setQrValue] = useState("");
  const [memid, setMemid] = useState("")
  const [memphoto, setMemphoto] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const currentPage = useRef(2);
  const userUrl = useRef("")

  useEffect(() => {
    (async function(){
    try {
        setIsLoading(true)
        let response = await axios.get('http://127.0.0.1:5000/member')
        const memberData = response.data.result[0]
        setQrValue(memberData.qrcodeurl)
        setMemid(memberData._id)
        setMemphoto(memberData.memberimgurl)
        setIsLoading(false)
        
      } catch(error){
      }
    }())
  }, []);  
  
  const generateQRCode = async() =>{
    try {
      let response = await axios.patch(`http://127.0.0.1:5000/member/${memid}`);
      const memberData = response.data.result[0]
      setQrValue(memberData.qrcodeurl)
    } catch (error) {
      console.log('error_generateQRCode',error)
    }
  }
  
  const getPhotos = async(page=currentPage.current) =>{
    try {
      const result = await axios.get(`${api}?client_id=${accessKey}&query=handsome&page=${page}&per_page=1`);
      const imgUrl = result.data.results[0].urls.thumb
      setMemphoto(imgUrl)
      userUrl.current = imgUrl
      currentPage.current +=1
      // console.log('memphoto',imgUrl)
      await axios.patch(`http://127.0.0.1:5000/member/${memid}`,{
        memberImgurl:imgUrl
      })
    } catch (error) { 
      console.log('error_getPhotos',error)
    }
    
  }

  const clickHandler = async () =>{
    setIsLoading(true)
    await generateQRCode()
    await getPhotos()
    setIsLoading(false)
  }

return (
  <div>
      <h1>QR Code 生成器</h1>
        <Loading isLoading={isLoading}/>
        <button type='submit' onClick={clickHandler}>下一張</button>
        <br/>
        <span>Member ID URL: </span>
        <strong>{qrValue}</strong>
      <div>
        <img src={memphoto} alt="" />
        {qrValue && (
          <QRCode
            value={qrValue}
            size={256} // QR Code 大小，以像素為單位
            level="H" // 容錯率：可選 'L', 'M', 'Q', 'H'；'H' 表示最高容錯率
            includeMargin // 包含邊界，使 QR Code 更容易被掃描
          />
        )}
      </div>
    </div>
  );
}

export default App;

