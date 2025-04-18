import psycopg2


def connect_db():
    # DEV PostgreSQL on AWS RDS
    conn = psycopg2.connect(
        database="bluefield",
        user="postgres",
        password="ZG4K8XV#5vYFu2",
        host="blufield-dev.cdisqic6sij3.ap-south-1.rds.amazonaws.com",
        port="5432",
        # you can also tune these if needed:
        # connect_timeout=10,
        # options='-c search_path=public'
    )
    return conn


brevo_api_key = "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"

replacement_metadata = {
    "1729686968114": "Account No",
    "1729686999219": "Successful ",
    "1729687054794": "Unsuccessful reason",
    "1729687182995": "Unsuccessful Photo",
    "1729687261115": "Customer Type",
    "1729687347497": "Connection Type",
    "1729688833286": "New Meter Photo",
    "1729688889424": "Signal Strength",
    "1729689063564": "Meter Seal (1)",
    "1729689083497": "Meter Seal (2)",
    "1729689110194": "Meter Seal (3)",
    "1729689161439": "SIM Number",
    "1729689199928": "IP Address",
    "1729687423352": "Old meter condition",
    "1729687591202": "Old Meter Make",
    "1729687781084": "Old Meter Make (Other)",
    "1729687887387": "Old Meter Year Of make",
    "1729688076197": "Meter reading (OLD)",
    "1729688120786": "Old Meter Photo",
    "1729688687183": "New Meter Make",
    "1729688732489": "New Meter Year  of Manufacturing",
    "1729688786043": "New Meter Reading ",
    "1729771209619": "Old Meter No",
    "1729688149231": "New Meter No",
    "1732352423131": "Type of temper",
    "1730585982538": "Tempered Photo",
}


wtr_salalah_metadata = {
    "1732578363590": "Account No",
    "1732577436970": "Read Type",
    "1732577901766": "Meter Reading",
    "1732578026002": "DM Type",
    "1732578107804": "UNR Type",
    "1732596857306": "Faulty Type",
    "1732577896645": "Photo",
    "1733180919947": "Bill delivered",
    "1733181019847": "Notice Delivered",
}


el_salalah_metadata = {
    "1732791266148": "Account No",
    "1732791304957": "Read Type",
    "1732791517485": "Door Lock Details",
    "1732791586594": "Faulty Details",
    "1732791681607": "Meter Reading",
    "1733301031732": "Notice delivered",
    "1733264752169": "Bill delivered",
    "1732791718308": "Photo",
    "1733264799067": "Photo of fuse",
    "1739093506738": "Panel Condition",
    "1739343708324": "Panel Photo",
}


el_raeco_metadata = {
    "1732791266148": "Account No",
    "1732791304957": "Read Type",
    "1732791517485": "Door Lock Details",
    "1732791586594": "Faulty Details",
    "1732791681607": "Meter Reading",
    "1733264752169": "Bill delivered",
    "1732791718308": "Photo",
    "1733264799067": "Photo of fuse",
    "1733301031732": "Notice delivered",
    "1739127228795": "Panel Condition",
    "1739351320221": "Panel Photo",
}

wtr_salalah_metadata = {
    "1732578363590": "Account No",
    "1732577436970": "Read Type",
    "1732577901766": "Meter Reading",
    "1732578026002": "DM Type",
    "1732578107804": "UNR Type",
    "1732596857306": "Faulty Type",
    "1732577896645": "Photo",
    "1733180919947": "Bill delivered",
    "1733181019847": "Notice Delivered",
}


metadata_water_nd = {
    # ND
    "1733387913982": "Account No",
    "1733387940560": "Delivery Status",
    "1733388353576": "Photo",
}

metadata_water_rc = {
    # RC
    "1738390223608": "Account Number",
    "1738390373879": "Activity Status RC",
    "1738390482276": "Photo After RC",
}

metadata_water_dc = {
    # DC
    "1738405259993": "Not reachable details",
    "1738389989466": "Account Number",
    "1738390041776": "Disconnection Status",
    "1738404678663": "Photo Proof of visit",
    "1738404411452": "Photo Before DC 1",
    "1738390162915": "Photo After DC 1",
    "1738404591700": "Photo Before DC 2",
    "1738404639070": "Photo After DC 2",
}

metadata_water_sv = {
    # SV
    "1738390752568": "Account Number",
    "1738390839061": "Meter Accessible",
    "1738390880589": "Connection Status",
    "1738390951121": "Not Misused- Status",
    "1738391017926": "Misused Status",
    "1738391148082": "Reason",
    "1738391180402": "Sitevisit Proof",
}


metadata_el_bd = {
    # BD
    "1733305633619": "Account Number",
    "1733305654652": "GPS Location",
}
metadata_el_bd_raeco = {
    # BD
    "1733305654652": "GPS Location",
    "1733305633619": "Account Number",
}
metadata_bd_water = {
    # BD
    "1733305749418": "Account Number",
    "1733305771536": "GPS Location",
}

metadata_el_nd = {
    # ND
    "1733388353576": "Photo",
    "1733387913982": "Account No",
    "1733387940560": "Activity Status",
}


metadata_el_rc = {
    # RC
    "1736426941205": "Account",
    "1736426993109": "Activity Status RC",
    "1736433949522": "Proof of Visit RC",
    "1736434047578": "Photo Before RC 1",
    "1736434122131": "Photo After RC 1",
    "1736434163851": "Photo Before RC 2",
    "1736434166841": "Photo After RC 2",
    "1736434281598": "Photo Before RC 3",
    "1736434284014": "Photo After RC 3",
}
metadata_el_dc = {
    # DC
    "1736055820690": "Account No",
    "1736055870826": "Activity Status DC",
    "1736056722642": "Proof of Visit DC",
    "1736056171032": "Photo Before DC 1",
    "1736056199096": "Photo After DC 1",
    "1736056465323": "Photo Before DC 2",
    "1736056507773": "Photo After DC 2",
    "1736056555884": "Photo Before DC 3",
    "1736056594400": "Photo After DC 3",
}
metadata_el_poledc = {
    # Pole DC
    "1736055820690": "Account No",
    "1736055870826": "Activity Status PoleDC",
    "1736056722642": "Proof of Visit PoleDC",
    "1736056171032": "Photo Before PoleDC 1",
    "1736056199096": "Photo After PoleDC 1",
    "1736056465323": "Photo Before PoleDC 2",
    "1736056507773": "Photo After PoleDC 2",
    "1736056555884": "Photo Before PoleDC 3",
    "1736056594400": "Photo After PoleDC 3",
}

metadata_el_sv = {
    # SV
    "1736434639219": "Account No",
    "1736434677138": "Meter Accessible",
    "1736435272060": "Not accessible reason",
    "1736435663134": "Other reason",
    "1736435486840": "Photo not Accessible",
    "1736435569346": "Connection Status",
    "1736435723322": "Activity Status",
    "1736435813746": "Photo Not Misused",
    "1736435881414": "Activity Status",
    "1736436072126": "Photo  Before DC",
    "1736441390398": "Photo After DC",
    "1736441462097": "Other Reason",
}


metadata_el_nd_raeco = {
    # ND
    "1733388353576": "Photo",
    "1733387913982": "Account No",
    "1733387940560": "Activity Status",
}


metadata_el_rc_raeco = {
    # RC
    "1736426941205": "Account",
    "1736426993109": "Activity Status RC",
    "1736433949522": "Proof of Visit RC",
    "1736434047578": "Photo Before RC 1",
    "1736434122131": "Photo After RC 1",
    "1736434163851": "Photo Before RC 2",
    "1736434166841": "Photo After RC 2",
    "1736434281598": "Photo Before RC 3",
    "1736434284014": "Photo After RC 3",
}

metadata_el_dc_raeco = {
    # DC
    "1736055820690": "Account No",
    "1736055870826": "Activity Status DC",
    "1736056722642": "Proof of Visit DC",
    "1736056171032": "Photo Before DC 1",
    "1736056199096": "Photo After DC 1",
    "1736056465323": "Photo Before DC 2",
    "1736056507773": "Photo After DC 2",
    "1736056555884": "Photo Before DC 3",
    "1736056594400": "Photo After DC 3",
}

metadata_el_poledc_raeco = {
    # Pole DC
    "1736055820690": "Account No",
    "1736055870826": "Activity Status PoleDC",
    "1736056722642": "Proof of Visit PoleDC",
    "1736056171032": "Photo Before PoleDC 1",
    "1736056199096": "Photo After PoleDC 1",
    "1736056465323": "Photo Before PoleDC 2",
    "1736056507773": "Photo After PoleDC 2",
    "1736056555884": "Photo Before PoleDC 3",
    "1736056594400": "Photo After PoleDC 3",
}

metadata_el_sv_raeco = {
    # SV
    "1736434639219": "Account No",
    "1736434677138": "Meter Accessible",
    "1736435272060": "Not accessible reason",
    "1736435663134": "Other reason",
    "1736435486840": "Photo not Accessible",
    "1736435569346": "Connection Status",
    "1736435723322": "Activity Status",
    "1736435813746": "Photo Not Misused",
    "1736435881414": "Activity Status",
    "1736436072126": "Photo  Before DC",
    "1736441390398": "Photo After DC",
    "1736441462097": "Other Reason",
}


majan_troublshoot = {
    "1731413391847": "Analog Meter Photh",
    "1731413475315": "House Photo",
    "1730718730674": "Account Number",
    "1730718187426": "Date Of Visit",
    "1730718373845": "Meter Reading",
    "1730718463684": "Database Location",
    "1730718513736": "Correct location",
    "1730718575787": "Status of meter/location",
    "1730718817866": "Meter Photo",
    "1730718856006": "Meter Panel Photo",
    "1730718887610": "Terminal Seal Photo ",
    "1730719007671": "Seal Condition",
    "1730719039202": "Number Of Seal 1",
    "1730719077500": "Number Of Seal 2",
    "1730719107680": "Number Of Seal 3",
    "1730719521223": "Number Of Seal 4",
    "1730719604038": "Fuse photo",
    "1730719645263": "Cutout Fuse ",
    "1730719807625": "Wiring Photo",
    "1730719871058": "Wiring Condition",
    "1730719929748": "Manufacturer",
    "1730720345101": "Meter Model ",
    "1730720397952": "Type Of Meter",
    "1730720485821": "Meter Size",
    "1730720609081": "CT Ratio ",
    "1730721119390": "CT coil",
    "1730721193119": "SIM Status",
    "1730721295803": "SIM No",
    "1730721383594": "R Phase Current Photo",
    "1730721500687": "R Phase Current Reading Meter",
    "1730721541180": "R Phase Current clamp meter photo",
    "1730721764315": "R phase current reading clamp meter",
    "1730721794292": "Y Phase Current Meter Photo",
    "1730721882109": "Y Phase Current Reading Meter",
    "1730721922382": "Y Phase Current Clamp Meter Photo",
    "1730721962950": "Y Phase Current Clamp Meter Reading",
    "1730724538413": "B Phase Current Meter Photo",
    "1730724579763": "B Phase Current Reading Meter",
    "1730724844674": "B Phase Current clamp meter Reading",
    "1730724884993": "B phase current reading clamp meter",
    "1730724924354": "R Phase Voltage Meter Photo",
    "1730725228508": "R Phase Voltage Reading Meter",
    "1730725267174": "R Phase Voltage clamp meter photo",
    "1730725316460": "R phase Voltage reading clamp meter",
    "1730725376653": "Y Phase Voltage Meter Photo",
    "1730725413050": "Y Phase Voltage Reading Meter",
    "1730725447510": "Y Phase Voltage clamp meter photo",
    "1730725497753": "Y phase Voltage reading clamp meter",
    "1730725565694": "B Phase Voltage Meter Photo",
    "1730725616040": "B Phase Voltage Reading Meter",
    "1730725647696": "B Phase Voltage clamp meter photo",
    "1730725686787": "B phase Voltage reading clamp meter",
    "1730725798305": "R Phase Current Photo",
    "1730725997534": "R Phase Current Reading Meter",
    "1730726034583": "R Phase Current clamp meter photo",
    "1730726066710": "R phase current reading clamp meter",
    "1730726109689": "R Phase Voltage Meter Photo",
    "1730726160357": "R Phase Voltage Reading Meter",
    "1730726196279": "R Phase Voltage clamp meter photo",
    "1730727270036": "R phase Voltage reading clamp meter",
    "1730727314194": "R Phase Current Reading Meter Photo First Capel 31.7.0",
    "1730727349953": "R Phase Current Reading Meter First Capel",
    "1730727590850": "R Phase Current reading clamp meter photo First Capel",
    "1730728183318": "R phase current reading clamp meter First Capel",
    "1730728262879": "R Phase Current Reading Meter Photo Sucond Capel",
    "1730728327221": "R Phase Current Reading Meter Sucond Capel",
    "1730728384369": "R Phase Current reading clamp meter photo Sucond Capel",
    "1730728446292": "R phase current reading clamp meter Sucond Capel",
    "1730728498488": "Y Phase Current Reading Meter Photo First Capel",
    "1730728562052": "Y Phase Current Reading Meter First Capel",
    "1730728878502": "Y Phase current reading clamp meter photo First Capel",
    "1730729301925": "Y phase current reading clamp meter First Capel",
    "1730729335583": "Y Phase Current Reading Meter Photo Sucond Capel",
    "1730729463691": "Y Phase Current Reading Meter Sucond Capel",
    "1730729505643": "Y Phase current reading clamp meter photo Sucond Capel",
    "1730729556033": "Y phase current reading clamp meter Sucond Capel",
    "1730729615067": "B Phase Current Meter Photo First Capel",
    "1730729705354": "B Phase Current Reading Meter First Capel",
    "1730729759681": "B Phase Current clamp meter Reading First Capel Photo",
    "1730729796897": "B phase current reading clamp meter",
    "1730729842406": "B Phase Current Meter Photo Sucond Capel",
    "1730729883944": "B Phase Current Reading Meter Sucond Capel",
    "1730730010454": "B Phase Current clamp meter Reading Sucond Capel Photo",
    "1730730065815": "B phase current reading clamp meter Sucond Capel",
    "1730730106841": "R Phase Voltage Meter Photo First Capel",
    "1730730177749": "R Phase Voltage Reading Meter First Capel",
    "1730730266557": "R Phase Voltage clamp meter photo First Capel",
    "1730730319683": "R phase Voltage reading clamp meter First Capel",
    "1730730518683": "R Phase Voltage Meter Photo Sucond Capel",
    "1730730559229": "R Phase Voltage Reading Meter Sucond Capel",
    "1730730639917": "R Phase Voltage clamp meter photo Sucond Capel",
    "1730730686409": "R phase Voltage reading clamp meter Sucond Capel",
    "1730730733413": "Y Phase Voltage Meter Photo First Capel",
    "1730730766547": "Y Phase Voltage Reading Meter First Capel",
    "1730730798998": "Y Phase Voltage clamp meter photo First Capel",
    "1730730832019": "Y phase Voltage reading clamp meter First Capel",
    "1730730881567": "Y Phase Voltage Meter Photo Sucond Capel",
    "1730730921371": "Y Phase Voltage Reading Meter Sucond Capel",
    "1730730961706": "Y Phase Voltage clamp meter photo Sucond Capel",
    "1730731202364": "Y phase Voltage reading clamp meter Sucond Capel",
    "1730731313036": "B Phase Voltage Meter Photo First Capel",
    "1730731351738": "B Phase Voltage Reading Meter First Capel",
    "1730731403180": "B Phase Voltage clamp meter photo First Capel",
    "1730731537870": "B phase Voltage reading clamp meter First Capel",
    "1730731588324": "B Phase Voltage Meter Photo Sucond",
    "1730731712379": "B Phase Voltage Reading Meter Sucond Capel",
    "1730731815667": "B Phase Voltage clamp meter photo Sucond Capel",
    "1730731864651": "B phase Voltage reading clamp meter Sucond Capel",
    "1730731964433": "illegal connection",
    "1730732049514": "Photo For Illegal Connection Before Fixing",
    "1730732165776": "Other Photo For Illegal Connection Before Fixing",
    "1730732304073": "Not Safe Connection Photo",
    "1730732339145": "Tamper Connection Before Fixing Photo",
    "1730732377475": "Other Tamper Connection Before Fixing Photo",
    "1730732605011": "Photo For Illegal Connection After Fixing",
    "1730732648392": "Tamper Connection After Fixing Photo",
    "1730732769403": "Approve Photo Not Completed",
    "1730732804860": "Approve Photo  incorrect location",
    "1730733023342": "Approve Photo   burnt meter",
    "1730733179230": "Approve Photo customer objection",
    "1730733260080": "Approve Photo customer  door lock",
    "1730733305795": "Reason for Not Completed",
    "1730733449262": "Approve Photo Not Completed",
    "1730733639838": "Approve Photo Not Completed",
    "1730733681605": "Approve Photo  disconnect Pole",
    "1730733725211": "Location Not Safe",
    "1730733818994": "Photo Of Demolished",
    "1730733892025": "General Comment ",
}

mmr_november_metadata = {
    "1728671952894": "Meter Number",
    "1728671986293": "READ TYPE",
    "1728672105809": "Meter Reading Photo ",
    "1728890318425": "Meter Reading",
    "1728672179367": "Photo Of Stop Meter Reading",
    "1728672218615": "Take Photo Of Tampered",
    "1728672282914": "Photo Of Disconnect Feeder",
    "1728672312232": "Photo Disconnect Pole",
    "1728672357579": "Photo Of Demolished",
    "1728672391788": "Location Photo",
    "1728672423045": "Door Lock Photo",
    "1728672458931": "Burnt Photo",
    "1728672501629": "Failed Connection Photo",
    "1728672541785": "Not Safe Photo",
    "1739274766535": "electricity meter or water meter",
    "1740214845694": "Photo of bill delivery",
    "1728671986293": "READ TYPE",
    "1740212207377": "Meter Reading Photo ",
    "1740212301210": "Meter Reading",
}


majan_site_visit = {
    "1730054050906": "Account No.",
    "1730054099644": "Meter No.",
    "1730054123649": "Panel Photo ",
    "1730054168459": "meter in the panel",
    "1730055039005": "Meter Reading Photo",
    "1730055142846": "Meter Reading",
    "1730054236511": "Meter Manufacturer",
    "1730054602399": "Meter Type",
    "1730054741108": "Meter Mounting Type",
    "1730054826840": "Meter CT Ratio",
    "1730054887854": "Meter Coil Photo",
    "1730054930105": "Meter Cabinet Type",
    "1730055184887": "General Comment",
}


email_sending_config = {
    "amr_dhofar": {
        "to": [
            {"email": "muhammad.tanvir@oneic.com.om", "name": "Muhammad Tanvir Arshad"},
            {"email": "ibrahim@oneic.com.om", "name": "Ibrahim Al Balushi"},
            {"email": "shahid@oneic.com.om", "name": "Shaihd Bhatt"},
        ],
        "to_cc": [{"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"}],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    "mmr_el_salalah_bak": {
        "to": [
            {"email": "farhan.mehmood@oneic.com.om", "name": "Farhan Mehmood"},
            {"email": "baha.alzreiqat@oneic.com.om", "name": "Baha Al Zreiqat"},
        ],
        "to_cc": [
            {"email": "omarr@disc.nama.om", "name": "Omarr"},
            {"email": "othmanro@disc.nama.om", "name": "OthmanRO"},
            {"email": "moaths@disc.nama.om", "name": "MOATHS"},
            {"email": "hassanf@disc.nama.om", "name": "HassanF"},
            {"email": "amirasr@dhofarservices.nama.om", "name": "AmiraSR"},
            {"email": "maryamak@dhofarservices.nama.om", "name": "MaryamAK"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    "mmr_el_salalah": {
        "to": [
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
        ],
        "to_cc": [
            {"email": "akhlaqshah447@gmail.com", "name": "Akhlaq Shah"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    "mmr_el_raeco": {
        "to": [
            {"email": "mairaj.unnabi@oneic.com.om", "name": "Mairaj Un Nabi"},
            {"email": "baha.alzreiqat@oneic.com.om", "name": "Baha Al Zreiqat"},
        ],
        "to_cc": [
            {"email": "omarr@disc.nama.om", "name": "Omarr"},
            {"email": "othmanro@disc.nama.om", "name": "OthmanRO"},
            {"email": "moaths@disc.nama.om", "name": "MOATHS"},
            {"email": "hassanf@disc.nama.om", "name": "HassanF"},
            {"email": "amirasr@dhofarservices.nama.om", "name": "AmiraSR"},
            {"email": "maryamak@dhofarservices.nama.om", "name": "MaryamAK"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    "mmr_wtr_salalah": {
        "to": [
            {"email": "qazi.zain@oneic.com.om", "name": "Qazi Qain Ahmed"},
            {"email": "baha.alzreiqat@oneic.com.om", "name": "Baha Al Zreiqat"},
        ],
        "to_cc": [
            {"email": "ghaiths@dhofarservices.nama.om", "name": "Ghaiths"},
            {"email": "omarr@dhofarservices.nama.om", "name": "Omarr"},
            {"email": "imansm@dhofarservices.nama.om", "name": "ImanSM"},
            {"email": "khadijasm@dhofarservices.nama.om", "name": "KhadijaSM"},
            {"email": "fatemass@dhofarservices.nama.om", "name": "Fatema SS"},
            {"email": "intisarma@dhofarservices.nama.om", "name": "Intisarma"},
            {"email": "Hassan.kashob@oneic.com.om", "name": "Hassan Kashob"},
            {"email": "Abdul.majeed@oneic.com.om", "name": "Abdul Majeed"},
            {"email": "Basim.mohammed@oneic.com.om", "name": "Basim Mohammed"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    "dcrc_el_salalah": {
        "to": [
            {"email": "muhammad.tanvir@oneic.com.om", "name": "Muhammad Tanvir Arshad"},
            {"email": "baha.alzreiqat@oneic.com.om", "name": "Baha Al Zreiqat"},
        ],
        "to_cc": [
            {"email": "mohammed.barami@oneic.com.om", "name": "Mohammed Barami"},
            {"email": "ibrahim@oneic.com.om", "name": "Ibrahim Al Balushi"},
            {"email": "faisal.alghafri@oneic.com.om", "name": "Faisal Al Ghafri"},
            {"email": "shahid@oneic.com.om", "name": "Shahid Bhatt"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    "dcrc_water_salalah": {
        "to": [
            {"email": "muhammad.tanvir@oneic.com.om", "name": "Muhammad Tanvir Arshad"},
            {"email": "baha.alzreiqat@oneic.com.om", "name": "Baha Al Zreiqat"},
        ],
        "to_cc": [
            {"email": "ibrahim@oneic.com.om", "name": "Ibrahim Al Balushi"},
            {"email": "ghassan.alidaas@oneic.com.om", "name": "Ghassan Al Idaas"},
            {"email": "faisal.alghafri@oneic.com.om", "name": "Faisal Al Ghafri"},
            {"email": "shahid@oneic.com.om", "name": "Shahid Bhatt"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    "dcrc_el_raeco": {
        "to": [
            {"email": "muhammad.tanvir@oneic.com.om", "name": "Muhammad Tanvir Arshad"},
            {"email": "baha.alzreiqat@oneic.com.om", "name": "Baha Al Zreiqat"},
        ],
        "to_cc": [
            {"email": "mohammed.barami@oneic.com.om", "name": "Mohammed Barami"},
            {"email": "faisal.alghafri@oneic.com.om", "name": "Faisal Al Ghafri"},
            {"email": "ibrahim@oneic.com.om", "name": "Ibrahim Al Balushi"},
            {"email": "shahid@oneic.com.om", "name": "Shahid Bhatt"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    "dcrc_el_performance": {
        "to": [
            {"email": "muhammad.tanvir@oneic.com.om", "name": "Muhammad Tanvir Arshad"},
            {"email": "baha.alzreiqat@oneic.com.om", "name": "Baha Al Zreiqat"},
            {"email": "mohammed.barami@oneic.com.om", "name": "Mohammed Barami"},
        ],
        "to_cc": [
            {"email": "ibrahim@oneic.com.om", "name": "Ibrahim Al Balushi"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    "bill_delivery": {
        "to": [
            {"email": "muhammad.tanvir@oneic.com.om", "name": "Muhammad Tanvir Arshad"},
            {"email": "baha.alzreiqat@oneic.com.om", "name": "Baha Al Zreiqat"},
            {"email": "farhan.mehmood@oneic.com.om", "name": "Farhan Mehmood"},
        ],
        "to_cc": [
            {"email": "ibrahim@oneic.com.om", "name": "Ibrahim Al Balushi"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    "notice_delivery": {
        "to": [
            {"email": "muhammad.tanvir@oneic.com.om", "name": "Muhammad Tanvir Arshad"},
            {"email": "baha.alzreiqat@oneic.com.om", "name": "Baha Al Zreiqat"},
            {"email": "farhan.mehmood@oneic.com.om", "name": "Farhan Mehmood"},
        ],
        "to_cc": [
            {"email": "ibrahim@oneic.com.om", "name": "Ibrahim Al Balushi"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    286: {
        "to": [
            {"email": "lamees.lkr@eemad.com", "name": "Lamees"},
            {"email": "rashid.zeidi@eemad.com", "name": "Rashid"},
            {"email": "aysha.aat@eemad.com", "name": "Aysha"},
            {"email": "adharsh.asl@eemad.com", "name": "Adharsh"},
        ],
        "to_cc": [
            {"email": "mohammed.msz@eemad.com", "name": "Mohammed"},
            {"email": "issa.zeidi@eemad.com", "name": "Issa"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    285: {
        "to": [
            {"email": "lamees.lkr@eemad.com", "name": "Lamees"},
            {"email": "rashid.zeidi@eemad.com", "name": "Rashid"},
            {"email": "aysha.aat@eemad.com", "name": "Aysha"},
            {"email": "adharsh.asl@eemad.com", "name": "Adharsh"},
        ],
        "to_cc": [
            {"email": "mohammed.msz@eemad.com", "name": "Mohammed"},
            {"email": "issa.zeidi@eemad.com", "name": "Issa"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    287: {
        "to": [
            {"email": "lamees.lkr@eemad.com", "name": "Lamees"},
            {"email": "rashid.zeidi@eemad.com", "name": "Rashid"},
            {"email": "aysha.aat@eemad.com", "name": "Aysha"},
            {"email": "adharsh.asl@eemad.com", "name": "Adharsh"},
        ],
        "to_cc": [
            {"email": "mohammed.msz@eemad.com", "name": "Mohammed"},
            {"email": "issa.zeidi@eemad.com", "name": "Issa"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    288: {
        "to": [
            {"email": "lamees.lkr@eemad.com", "name": "Lamees"},
            {"email": "rashid.zeidi@eemad.com", "name": "Rashid"},
            {"email": "aysha.aat@eemad.com", "name": "Aysha"},
            {"email": "adharsh.asl@eemad.com", "name": "Adharsh"},
        ],
        "to_cc": [
            {"email": "mohammed.msz@eemad.com", "name": "Mohammed"},
            {"email": "issa.zeidi@eemad.com", "name": "Issa"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    307: {
        "to": [
            {"email": "lamees.lkr@eemad.com", "name": "Lamees"},
            {"email": "rashid.zeidi@eemad.com", "name": "Rashid"},
            {"email": "aysha.aat@eemad.com", "name": "Aysha"},
            {"email": "adharsh.asl@eemad.com", "name": "Adharsh"},
        ],
        "to_cc": [
            {"email": "mohammed.msz@eemad.com", "name": "Mohammed"},
            {"email": "issa.zeidi@eemad.com", "name": "Issa"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    263: {
        "to": [
            {"email": "lamees.lkr@eemad.com", "name": "Lamees"},
            {"email": "rashid.zeidi@eemad.com", "name": "Rashid"},
            {"email": "aysha.aat@eemad.com", "name": "Aysha"},
            {"email": "adharsh.asl@eemad.com", "name": "Adharsh"},
        ],
        "to_cc": [
            {"email": "mohammed.msz@eemad.com", "name": "Mohammed"},
            {"email": "issa.zeidi@eemad.com", "name": "Issa"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
    326: {
        "to": [
            {"email": "lamees.lkr@eemad.com", "name": "Lamees"},
            {"email": "rashid.zeidi@eemad.com", "name": "Rashid"},
            {"email": "aysha.aat@eemad.com", "name": "Aysha"},
            {"email": "adharsh.asl@eemad.com", "name": "Adharsh"},
        ],
        "to_cc": [
            {"email": "mohammed.msz@eemad.com", "name": "Mohammed"},
            {"email": "issa.zeidi@eemad.com", "name": "Issa"},
        ],
        "bcc": [
            {"email": "ammar@outbox.om", "name": "Ammar Al Adwani"},
            {"email": "sareem@outbox.om", "name": "Sayed Sareem"},
            {"email": "akhlaq@outbox.om", "name": "Akhlaq Shah"},
            {"email": "vivek.sha@outbox.om", "name": "Vivek Shahi"},
        ],
    },
}
