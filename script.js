let userEmail = "";
let userOtp = 0;

async function sendOtp(email, userOtp) {
    userEmail = email;
    try {
        const response = await fetch("https://api.allrides.in/api/v1/auth/send-otp-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email })
        });

        if (response.ok) {
            document.getElementById("form-container").innerHTML = `
                    <h3>OTP Verification</h3>
                    <p class="text-muted">Enter the OTP sent to your email.</p>
                    <form id="otp-form" class="mt-4">
                        <div class="mb-3">
                            <label for="otp" class="form-label">OTP</label>
                            <input type="text" class="form-control" id="otp" required>
                        </div>
                        <button type="submit" class="btn btn-success w-100">Verify OTP</button>
                    </form>
                `;
            document.getElementById("otp-form").addEventListener("submit", function (event) {
                event.preventDefault();
                userOtp = document.getElementById("otp").value;
                verifyOtp(userEmail, userOtp);
            });
        } else {
            console.error("Error sending OTP");
        }
    } catch (error) {
        console.error("Network error:", error);
    }
}




async function verifyOtp(email, otp) {

    const data = {
        email: email,
        otp: Number(otp)
    };

    try {
        const response = await fetch("https://api.allrides.in/api/v1/auth/verify-otp", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            alert('OTP verification failed');
            throw new Error('OTP verification failed');
        }
        alert('OTP verification successful');
        
        const responseData = await response.json();
        // console.log('Response Data:', responseData);
        const accessToken =  responseData.data.security.jwtAccessToken;
        const refreshToken = responseData.data.security.jwtRefreshToken;
        // console.log('Access Token:', accessToken);
        // console.log('Refresh Token:', refreshToken);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        window.location.href = "index.html";
    } catch (error) {
        console.error('Error:', error);
    }
};








async function generateAccessToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
        const response = await fetch('https://api.allrides.in/api/v1/auth/access-token', {
            method: 'POST',
            body: JSON.stringify({ refreshToken: refreshToken }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Error generating access token');
            throw new Error('Error generating access token');
        }

        const responseData = await response.json();
        const accessToken = responseData.data.security.jwtAccessToken;
        console.log('Access Token:', accessToken);
        localStorage.setItem("accessToken", accessToken);
        return accessToken;
    } catch (error) {
        console.error('Error:', error);
    }
}



async function getBusData(accessToken) {
    try {
        const response = await fetch('https://api.allrides.in/api/v1/bus', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken  // Ensure token is prefixed
            }
        });

        // If unauthorized, refresh token and retry
        if (response.status === 401) {
            console.warn('Unauthorized. Generating new access token...');
            const newToken = await generateAccessToken();  // Fetch new token
            return getBusData(newToken);  // Retry with new token
        }

        // Handle other errors
        if (!response.ok) {
            console.error('Error:', response.statusText);
            throw new Error('Error fetching bus data');
        }

        // Convert response to JSON
        const data = await response.json();
        return data.data;
          // Return bus data

    } catch (error) {
        console.error('Network Error:', error);
        throw error;
    }
}


async function addBusData(accessToken, busName, busNumber, owner) {
    try {
        const response = await fetch('https://api.allrides.in/api/v1/bus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken  // Ensure token is prefixed
            },

            body: JSON.stringify({
               name: busName,
               number: busNumber,
               bus_owner_id: Number(owner)
            })
            
        });

        // If unauthorized, refresh token and retry
        if (response.status === 401) {
            console.warn('Unauthorized. Generating new access token...');
            const newToken = await generateAccessToken();  // Fetch new token
            getBusData(newToken);  // Retry with new token
        }

        // Handle other errors
        if (!response.ok) {
            console.error('Error:', response.statusText);
            throw new Error('Error fetching bus data');
        }

        // Convert response to JSON
        const data = await response.json();
        return data.data;
          // Return bus data

    } catch (error) {
        console.error('Network Error:', error);
        throw error;
    }
}


async function addOwnerData(accessToken,name, mobile, email, address) {
    try {
        const response = await fetch('https://api.allrides.in/api/v1/bus_owner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken  // Ensure token is prefixed
            },

            body: JSON.stringify({
               name: name,
               mobile_number: mobile,
                email: email,
                address: address
            })
            
        });

        // If unauthorized, refresh token and retry
        if (response.status === 401) {
            console.warn('Unauthorized. Generating new access token...');
            const newToken = await generateAccessToken();  // Fetch new token
            getBusData(newToken);  // Retry with new token
        }

        // Handle other errors
        if (!response.ok) {
            console.error('Error:', response.statusText);
            throw new Error('Error fetching bus data');
        }

        // Convert response to JSON
        const data = await response.json();
        return data.data;
          // Return bus data

    } catch (error) {
        console.error('Network Error:', error);
        throw error;
    }
}

async function getOwnerData(accessToken) {
    try {
        const response = await fetch('https://api.allrides.in/api/v1/bus_owner', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken  // Ensure token is prefixed
            }
        });

        // If unauthorized, refresh token and retry
        if (response.status === 401) {
            console.warn('Unauthorized. Generating new access token...');
            const newToken = await generateAccessToken();  // Fetch new token
            return getOwnerData(newToken);  // Retry with new token
        }

        // Handle other errors
        if (!response.ok) {
            console.error('Error:', response.statusText);
            throw new Error('Error fetching owner data');
        }

        // Convert response to JSON
        const data = await response.json();
        return data.data;
          // Return bus data

    } catch (error) {
        console.error('Network Error:', error);
        throw error;
    }
}



//creating user (retrive the userid)
async function createUser(accessToken,name, mobile, email) {
    try {
        const response = await fetch('https://api.allrides.in/api/v1/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken  // Ensure token is prefixed
            },

            body: JSON.stringify({
               user_name: name,
               phone_number: mobile,
                email: email,
                
            })
            
        });

        // If unauthorized, refresh token and retry
        if (response.status === 401) {
            console.warn('Unauthorized. Generating new access token...');
            const newToken = await generateAccessToken();  // Fetch new token
            createUser(newToken);  // Retry with new token
        }

        // Handle other errors
        if (!response.ok) {
            console.error('Error:', response.statusText);
            throw new Error('Error creating user data');
        }

        // Convert response to JSON
        const data = await response.json();
        return data;
          // Return created user data

    } catch (error) {
        console.error('Network Error:', error);
        throw error;
    }
}

//creating conductor
async function addConductorData(accessToken,userID, bus) {
    try {
        const response = await fetch('https://api.allrides.in/api/v1/conductor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken  // Ensure token is prefixed
            },

            body: JSON.stringify({
               bus_id: bus,
               user_id: userID,
                
                
            })
            
        });

        // If unauthorized, refresh token and retry
        if (response.status === 401) {
            console.warn('Unauthorized. Generating new access token...');
            const newToken = await generateAccessToken();  // Fetch new token
            addConductorData(newToken);  // Retry with new token
        }

        // Handle other errors
        if (!response.ok) {
            console.error('Error:', response.statusText);
            throw new Error('Error fetching bus data');
        }

        // Convert response to JSON
        const data = await response.json();
        return data;
          // Return conductor data

    } catch (error) {
        console.error('Network Error:', error);
        throw error;
    }
}

async function getConductorData(accessToken) {
    try {
        const response = await fetch('https://api.allrides.in/api/v1/conductor', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken  // Ensure token is prefixed
            }
        });

        // If unauthorized, refresh token and retry
        if (response.status === 401) {
            console.warn('Unauthorized. Generating new access token...');
            const newToken = await generateAccessToken();  // Fetch new token
            return getConductorData(newToken);  // Retry with new token
        }

        // Handle other errors
        if (!response.ok) {
            console.error('Error:', response.statusText);
            throw new Error('Error fetching owner data');
        }

        // Convert response to JSON
        const data = await response.json();
        return data.data;
          // Return bus data

    } catch (error) {
        console.error('Network Error:', error);
        throw error;
    }
}

function logOut() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "login.html";
}