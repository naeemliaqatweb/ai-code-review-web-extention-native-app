<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $rewrite->resume->user->name }} - Creative</title>
    <style>
        @page { margin: 0; }
        body {
            font-family: {{ $rewrite->style_config['fontFamily'] == 'serif' ? "'Times New Roman', serif" : ($rewrite->style_config['fontFamily'] == 'mono' ? "'Courier New', monospace" : "'Helvetica', 'Arial', sans-serif") }};
            color: #1e293b;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            background-color: {{ $rewrite->style_config['backgroundColor'] ?? '#ffffff' }};
        }
        .container { padding: 0; }
        .top-banner { background: {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }}; height: 250px; position: relative; }
        .profile-container { position: absolute; top: 150px; left: 60px; display: table; width: 90%; }
        .profile-img { width: 160px; height: 160px; border-radius: 40px; border: 8px solid white; object-fit: cover; display: table-cell; }
        .info-cell { display: table-cell; vertical-align: bottom; padding-left: 40px; padding-bottom: 20px; }
        .name { font-size: 42px; font-weight: 900; color: #ffffff; text-shadow: 0 4px 10px rgba(0,0,0,0.1); margin: 0; }
        .sub { font-size: 14px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: 4px; opacity: 0.8; }
        .content { margin: 120px 60px 60px; display: table; width: calc(100% - 120px); }
        .left-col { display: table-cell; width: 65%; padding-right: 50px; }
        .right-col { display: table-cell; width: 35%; vertical-align: top; border-left: 1px solid #f1f5f9; padding-left: 50px; }
        .section-title { font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }}; margin-top: 40px; margin-bottom: 20px; }
        .summary { font-size: 15px; color: #334155; line-height: 1.6; }
        .exp-item { margin-bottom: 35px; }
        .exp-role { font-size: 18px; font-weight: 800; }
        .exp-comp { font-size: 12px; font-weight: bold; color: {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }}; margin-bottom: 10px; }
        .skill-list { display: block; }
        .skill-item { margin-bottom: 12px; }
        .skill-name { font-size: 11px; font-weight: 900; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
        .skill-bar { height: 6px; background: #f1f5f9; border-radius: 10px; position: relative; width: 100%; }
        .skill-fill { position: absolute; top: 0; left: 0; height: 100%; background: {{ $rewrite->style_config['primaryColor'] ?? '#4f46e5' }}; border-radius: 10px; width: 85%; }
        .contact-item { font-size: 11px; font-weight: 700; margin-bottom: 10px; color: #475569; }
    </style>
</head>
<body>
    <div class="top-banner"></div>
    <div class="profile-container">
        @if($rewrite->profile_image)
            <img src="{{ public_path('storage/' . $rewrite->profile_image) }}" class="profile-img">
        @else
            <div class="profile-img" style="background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: white; font-size: 60px; font-weight: 900;">{{ substr($rewrite->resume->user->name, 0, 1) }}</div>
        @endif
        <div class="info-cell">
            <h1 class="name">{{ $rewrite->resume->user->name }}</h1>
            <div class="sub">Portfolio Highlights</div>
        </div>
    </div>

    <div class="content">
        <div class="left-col">
            <div class="section-title" style="margin-top: 0;">Identity</div>
            <p class="summary">{{ $rewrite->summary }}</p>

            <div class="section-title">Milestones</div>
            @foreach($rewrite->experience as $item)
                <div class="exp-item">
                    <div class="exp-role">{{ $item['role'] }}</div>
                    <div class="exp-comp">{{ $item['company'] }} | {{ $item['duration'] }}</div>
                    <div style="font-size: 13px; color: #475569;">
                        @foreach($item['achievements'] as $ach)
                            • {{ $ach }}<br>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </div>
        <div class="right-col">
            <div class="section-title" style="margin-top: 0;">Connect</div>
            <div class="contact-item">Email: {{ $rewrite->contact_details['email'] ?? $rewrite->resume->user->email }}</div>
            @if(isset($rewrite->contact_details['phone'])) <div class="contact-item">Phone: {{ $rewrite->contact_details['phone'] }}</div> @endif
            @if(isset($rewrite->contact_details['location'])) <div class="contact-item">Base: {{ $rewrite->contact_details['location'] }}</div> @endif
            @if(isset($rewrite->contact_details['linkedin'])) <div class="contact-item">Pulse: {{ $rewrite->contact_details['linkedin'] }}</div> @endif

            <div class="section-title">Hard Skills</div>
            @foreach($rewrite->skills as $skill)
                <div class="skill-item">
                    <div class="skill-name">{{ $skill }}</div>
                    <div class="skill-bar"><div class="skill-fill"></div></div>
                </div>
            @endforeach
        </div>
    </div>
</body>
</html>
