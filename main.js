let localStream;
let remoteStream;
let PeerConnection;

const server = {
    iceServers: [
        {
            urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302'],
        }
    ]
}

let init=async ()=>{
  localStream=await navigator.mediaDevices.getUserMedia({audio:false,video: { width: 300, height: 300,bordeRadius:'50%' }});
  document.getElementById("user-1").srcObject=localStream;
}

let createOffer=async()=>{
     PeerConnection=new RTCPeerConnection(server);
     remoteStream= new MediaStream();
     document.getElementById("user-2").srcObject=remoteStream;
   
    localStream.getTracks().forEach(track=>{
        PeerConnection.addTrack(track,localStream);
    })

    PeerConnection.ontrack=async(event)=>{
       event.streams[0].getTracks().forEach(track=>{
           remoteStream.addTrack(track);
       })
    }

    PeerConnection.onicecandidate=async(event)=>{
       if(event.candidate){
            document.getElementById("create-offerInput").value=JSON.stringify(PeerConnection.localDescription);
         }
    }
    let offer= await PeerConnection.createOffer();
    PeerConnection.setLocalDescription(offer);
    document.getElementById("create-offerInput").value=JSON.stringify(offer);
   

}


let createAnswer=async()=>{
     PeerConnection=new RTCPeerConnection(server);
     remoteStream= new MediaStream();
     document.getElementById("user-2").srcObject=remoteStream;
   
    localStream.getTracks().forEach(track=>{
        PeerConnection.addTrack(track,localStream);
    })

    PeerConnection.ontrack=async(event)=>{
       event.streams[0].getTracks().forEach(track=>{
           remoteStream.addTrack(track);
       })
    }

    PeerConnection.onicecandidate=async(event)=>{
        if(event.candidate){
            document.getElementById("create-answerInput").value=JSON.stringify(PeerConnection.localDescription);
        }
    }

    let offer= document.getElementById("create-offerInput").value;
    offer = JSON.parse(offer);
    await PeerConnection.setRemoteDescription(offer);
    let answer= PeerConnection.createAnswer();
    await PeerConnection.setLocalDescription(answer);
    document.getElementById("create-answerInput").value=JSON.stringify(answer);
}

const addAnswer=()=>{
    console.log("here")
    let answer= document.getElementById("create-answerInput").value;
    answer = JSON.parse(answer);
    if(!PeerConnection.currentRemoteConnection){
        PeerConnection.setRemoteDescription(answer);
    }
}


init();
document.getElementById("create-offer").addEventListener("click", createOffer);
document.getElementById("create-answer").addEventListener("click", createAnswer);
document.getElementById("add-ans").addEventListener("click", addAnswer);