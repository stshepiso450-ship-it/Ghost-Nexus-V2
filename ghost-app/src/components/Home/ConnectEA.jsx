const connect = async () => {
    try {

        const res = await DashboardAPI.activateLicense(
            licenseKey,
            mt5Account,
            navigator.userAgent
        );

        if (res.valid && res.active) {

            setConnected(true);

            localStorage.setItem("ghost_license", licenseKey);

            alert("License Activated Successfully");

        } else {

            alert("License Invalid");

        }

    } catch (err) {

        alert(err.message);

    }
};